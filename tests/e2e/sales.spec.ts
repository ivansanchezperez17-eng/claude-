import { expect, test } from "@playwright/test";
import zlib from "node:zlib";

const MOCK = "http://127.0.0.1:54321";

// PNG mínimo de 2x2 píxeles, generado en memoria para la prueba de fotos.
function tinyPng() {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf: Buffer) => {
    let c = 0xffffffff;
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc(body));
    return Buffer.concat([len, body, sum]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(2, 0);
  ihdr.writeUInt32BE(2, 4);
  ihdr[8] = 8; // 8 bits
  ihdr[9] = 2; // RGB
  const raw = Buffer.from([0, 200, 100, 50, 200, 100, 50, 0, 200, 100, 50, 200, 100, 50]);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

test.describe("ficha: botón de WhatsApp grande", () => {
  test("botón visible que pasa por /go con el idioma", async ({ page }) => {
    await page.goto("/es/negocio/hotel-aprobado");
    const button = page.getByRole("link", { name: /WhatsApp/ }).first();
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("href", "/go/hotel-aprobado?lang=es");

    await page.goto("/en/negocio/hotel-aprobado");
    await expect(page.getByRole("link", { name: /WhatsApp/ }).first()).toHaveAttribute(
      "href",
      "/go/hotel-aprobado?lang=en",
    );
  });

  test("barra fija abajo en celular", async ({ page }) => {
    await page.goto("/es/negocio/hotel-aprobado");
    const bar = page.locator("[data-sticky-cta]");
    await expect(bar).toBeVisible();
    const box = await bar.boundingBox();
    const viewport = page.viewportSize();
    expect(box && viewport && box.y + box.height).toBeGreaterThanOrEqual((viewport?.height ?? 0) - 2);
  });

  test("el clic queda registrado", async ({ page, request }) => {
    const before = (await (await request.get(`${MOCK}/__test/state`)).json()).clicks.length;
    await page.route("https://wa.me/**", (route) => route.fulfill({ body: "wa.me" }));
    await page.goto("/es/negocio/tour-ejemplo");
    await page.getByRole("link", { name: /WhatsApp/ }).first().click();
    await expect(page).toHaveURL(/wa\.me\/573000000001\?text=Hola/);
    const state = await (await request.get(`${MOCK}/__test/state`)).json();
    expect(state.clicks.length).toBe(before + 1);
    expect(state.clicks.at(-1)).toMatchObject({
      business_id: "11111111-1111-1111-1111-111111111111",
      locale: "es",
    });
  });
});

test.describe("ficha completa", () => {
  test("foto próximamente, mapa y relacionados", async ({ page }) => {
    await page.goto("/es/negocio/hotel-aprobado");
    await expect(page.getByText("Foto próximamente").first()).toBeVisible();
    await expect(page.locator('iframe[title="Mapa de Hotel Aprobado"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Tour de Ejemplo" })).toBeVisible();
    await expect(page.getByText(/Secreto/)).toHaveCount(0);
  });
});

test.describe("página para negocios", () => {
  test("WhatsApp activo y precios del panel (ES)", async ({ page }) => {
    await page.goto("/es/negocios");
    await expect(page.getByText(/próximamente/i)).toHaveCount(0);
    const wa = page.getByRole("link", { name: "Escríbenos por WhatsApp" });
    await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/573004678975\?text=/);
    await expect(page.getByText("$100.000 COP / mes")).toBeVisible();
    await expect(page.getByText("A convenir")).toHaveCount(2);
  });

  test("precios en inglés con dólares aproximados", async ({ page }) => {
    await page.goto("/en/business");
    await expect(page.getByText(/COP 100,000 \/ month/)).toBeVisible();
    await expect(page.getByText("To be agreed")).toHaveCount(2);
  });

  test("el formulario rechaza datos inválidos", async ({ page, request }) => {
    const before = (await (await request.get(`${MOCK}/__test/state`)).json()).applications.length;
    await page.goto("/es/negocios");
    await page.getByLabel("Nombre del negocio").fill("Café Prueba");
    await page.getByLabel("Nombre del responsable").fill("Ana Pérez");
    await page.getByLabel("Teléfono o WhatsApp").fill("abc");
    await page.getByLabel("Categoría").selectOption("restaurante");
    await page.getByLabel("Describe tu negocio").fill("corto");
    await page.getByLabel(/Autorizo/).check();
    await page.getByLabel(/Acepto/).check();
    await page.getByRole("button", { name: "Enviar solicitud" }).click();
    await expect(page.getByText(/teléfono válido/)).toBeVisible();
    await expect(page.getByText(/mínimo 10 caracteres/)).toBeVisible();
    const after = (await (await request.get(`${MOCK}/__test/state`)).json()).applications.length;
    expect(after).toBe(before);
  });

  test("solicitud válida con foto llega con autorización", async ({ page, request }) => {
    await page.goto("/es/negocios");
    await page.getByLabel("Nombre del negocio").fill("Café Prueba");
    await page.getByLabel("Nombre del responsable").fill("Ana Pérez");
    await page.getByLabel("Teléfono o WhatsApp").fill("300 123 4567");
    await page.getByLabel("Categoría").selectOption("restaurante");
    await page.getByLabel("Describe tu negocio").fill("Café de prueba en el centro de Barichara.");
    await page.locator('input[name="photos"]').setInputFiles({
      name: "foto.png",
      mimeType: "image/png",
      buffer: tinyPng(),
    });
    await expect(page.getByText("1 foto lista")).toBeVisible();
    await page.getByLabel(/Autorizo/).check();
    await page.getByLabel(/Acepto/).check();
    await page.getByRole("button", { name: "Enviar solicitud" }).click();
    await expect(page).toHaveURL(/\/es\/negocios\?enviado=1/);
    await expect(page.getByText("¡Recibimos tu solicitud!")).toBeVisible();

    const state = await (await request.get(`${MOCK}/__test/state`)).json();
    const app = state.applications.at(-1);
    expect(app).toMatchObject({ business_name: "Café Prueba", authorized: true, privacy_accepted: true });
    expect(app.photo_paths).toHaveLength(1);
    expect(app.photo_paths[0]).toMatch(/^pending\/[0-9a-f-]+\/1\.jpg$/);
    expect(state.uploads.some((u: { path: string }) => u.path === app.photo_paths[0])).toBe(true);
  });
});
