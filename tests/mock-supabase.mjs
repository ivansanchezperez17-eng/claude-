// Servidor mínimo que imita la API REST de Supabase (PostgREST) con datos de
// prueba, para poder correr el sitio y las pruebas sin tocar la base real.
// Aplica la misma regla que la base de datos: el público solo ve "aprobado".
import http from "node:http";

const PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 54321);
const DEMO_PASSWORD = "demo-test";

const base = {
  zone: null,
  description_en: null,
  phone: null,
  price_range: null,
  schedule: null,
  duration: null,
  map_url: null,
  website: null,
  instagram: null,
  source_url: null,
  plan: null,
  authorized_at: null,
  authorized_by: null,
  authorization_channel: null,
  active: false,
  next_payment_due: null,
  created_at: "2026-10-01T00:00:00Z",
};

export const businesses = [
  {
    ...base,
    id: "11111111-1111-1111-1111-111111111111",
    slug: "tour-ejemplo",
    name: "Tour de Ejemplo",
    category: "experiencia",
    description_es: "Tour ficticio de prueba.",
    description_en: "Fictional test tour.",
    whatsapp: "573000000001",
    price_from: "Desde $80.000",
    duration: "2 horas",
    is_sample: true,
    status: "aprobado",
  },
  {
    ...base,
    id: "22222222-2222-2222-2222-222222222222",
    slug: "hotel-aprobado",
    name: "Hotel Aprobado",
    category: "hotel",
    description_es: "Hotel aprobado de prueba.",
    description_en: "Approved test hotel.",
    whatsapp: "573000000002",
    zone: "Calle 1 # 2-3",
    map_url: "https://www.google.com/maps/search/?api=1&query=Barichara",
    is_sample: false,
    status: "aprobado",
  },
  {
    ...base,
    id: "33333333-3333-3333-3333-333333333333",
    slug: "hotel-borrador",
    name: "Hotel Borrador Secreto",
    category: "hotel",
    description_es: "Este negocio NO debe aparecer en público.",
    whatsapp: "573000000003",
    is_sample: false,
    status: "borrador",
  },
  {
    ...base,
    id: "44444444-4444-4444-4444-444444444444",
    slug: "restaurante-rechazado",
    name: "Restaurante Rechazado Secreto",
    category: "restaurante",
    description_es: "Rechazado: no debe aparecer en ningún lado.",
    is_sample: false,
    status: "rechazado",
  },
];

export const clicks = [];

const tables = { businesses, business_photos: [], business_clicks: clicks };

function publicRows(table) {
  if (table === "businesses") return businesses.filter((b) => b.status === "aprobado");
  if (table === "business_clicks") return [];
  return tables[table] ?? [];
}

function applyFilters(rows, params) {
  let out = rows;
  for (const [key, raw] of params) {
    if (["select", "order", "limit", "offset"].includes(key)) continue;
    const [op, ...rest] = raw.split(".");
    const value = rest.join(".");
    if (op === "eq") out = out.filter((r) => String(r[key]) === value);
    else if (op === "neq") out = out.filter((r) => String(r[key]) !== value);
    else if (op === "ilike") {
      const needle = value.replaceAll("*", "").replaceAll("%", "").toLowerCase();
      out = out.filter((r) => String(r[key] ?? "").toLowerCase().includes(needle));
    } else if (op === "in") {
      const list = value.replace(/^\(|\)$/g, "").split(",").map((v) => v.replace(/"/g, ""));
      out = out.filter((r) => list.includes(String(r[key])));
    }
  }
  const limit = params.get("limit");
  if (limit) out = out.slice(0, Number(limit));
  return out;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "content-type": "application/json", ...headers });
  res.end(body === undefined ? "" : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data ? JSON.parse(data) : {}));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (path.startsWith("/auth/v1/")) return send(res, 401, { message: "no session" });

  const rpc = path.match(/^\/rest\/v1\/rpc\/(\w+)$/);
  if (rpc && req.method === "POST") {
    const body = await readBody(req);
    const ok = body.p_password === DEMO_PASSWORD;
    if (rpc[1] === "demo_check") return send(res, 200, ok);
    if (!ok) return send(res, 400, { code: "28P01", message: "invalid demo password" });
    const visible = businesses.filter((b) => b.status !== "rechazado");
    if (rpc[1] === "demo_businesses") return send(res, 200, visible);
    if (rpc[1] === "demo_business") return send(res, 200, visible.filter((b) => b.slug === body.p_slug));
    return send(res, 404, { message: "unknown rpc" });
  }

  const table = path.match(/^\/rest\/v1\/(\w+)$/)?.[1];
  if (!table) return send(res, 404, { message: "not found" });

  if (req.method === "POST") {
    const body = await readBody(req);
    const rows = Array.isArray(body) ? body : [body];
    if (table === "business_clicks") {
      const approvedIds = businesses.filter((b) => b.status === "aprobado").map((b) => b.id);
      if (!rows.every((r) => approvedIds.includes(r.business_id))) {
        return send(res, 403, { code: "42501", message: "row-level security" });
      }
    }
    tables[table]?.push(...rows);
    return send(res, 201, rows);
  }

  if (req.method === "GET" || req.method === "HEAD") {
    const rows = applyFilters(publicRows(table), url.searchParams);
    const wantsObject = (req.headers.accept ?? "").includes("vnd.pgrst.object");
    if (wantsObject) {
      if (rows.length !== 1) {
        return send(res, 406, {
          code: "PGRST116",
          message: "JSON object requested, multiple (or no) rows returned",
          details: `The result contains ${rows.length} rows`,
        });
      }
      return send(res, 200, rows[0]);
    }
    return send(res, 200, rows, { "content-range": `0-${rows.length - 1}/${rows.length}` });
  }

  send(res, 405, { message: "method not allowed" });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, "127.0.0.1", () => console.log(`mock supabase on :${PORT}`));
}

export { server, DEMO_PASSWORD };
