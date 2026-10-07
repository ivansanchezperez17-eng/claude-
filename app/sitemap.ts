import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://visit-barichara.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from("businesses")
    .select("slug, created_at")
    .eq("status", "aprobado");

  const staticPaths = ["", "directorio", "negocios", "politica-privacidad"];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) => [
    { url: `${SITE_URL}/es${path ? `/${path}` : ""}` },
    {
      url: `${SITE_URL}/en${
        path === "negocios"
          ? "/business"
          : path === "politica-privacidad"
            ? "/privacy-policy"
            : path
              ? `/${path}`
              : ""
      }`,
    },
  ]);

  const businessEntries: MetadataRoute.Sitemap = (businesses ?? []).flatMap(
    (business) => [
      {
        url: `${SITE_URL}/es/negocio/${business.slug}`,
        lastModified: business.created_at,
      },
      {
        url: `${SITE_URL}/en/negocio/${business.slug}`,
        lastModified: business.created_at,
      },
    ],
  );

  return [...staticEntries, ...businessEntries];
}
