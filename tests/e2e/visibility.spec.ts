import { expect, test } from "@playwright/test";

// Datos del simulador (tests/mock-supabase.mjs):
//   Tour de Ejemplo (ejemplo, aprobado) · Hotel Aprobado (aprobado)
//   Hotel Borrador Secreto (borrador) · Restaurante Rechazado Secreto (rechazado)
const SECRET = /Secreto/;

test.describe("un borrador nunca aparece en público", () => {
  for (const locale of ["es", "en"]) {
    test(`directorio /${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/directorio`);
      await expect(page.getByRole("heading", { name: "Hotel Aprobado" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Tour de Ejemplo" })).toBeVisible();
      await expect(page.getByText(SECRET)).toHaveCount(0);
    });
  }

  test("buscador del directorio", async ({ page }) => {
    await page.goto("/es/directorio?q=Secreto");
    await expect(page.getByText(SECRET)).toHaveCount(0);
  });

  test("inicio", async ({ page }) => {
    await page.goto("/es");
    await expect(page.getByText(SECRET)).toHaveCount(0);
  });

  test("ficha por URL directa da 404", async ({ page }) => {
    for (const slug of ["hotel-borrador", "restaurante-rechazado"]) {
      const response = await page.goto(`/es/negocio/${slug}`);
      expect(response?.status()).toBe(404);
      await expect(page.getByText(SECRET)).toHaveCount(0);
    }
  });

  test("sitemap", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    expect(body).toContain("hotel-aprobado");
    expect(body).not.toContain("hotel-borrador");
    expect(body).not.toContain("restaurante-rechazado");
  });
});

test.describe("ficha de negocio", () => {
  for (const locale of ["es", "en"]) {
    test(`abre y se queda en su URL /${locale}`, async ({ page }) => {
      const response = await page.goto(`/${locale}/negocio/hotel-aprobado`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`/${locale}/negocio/hotel-aprobado$`));
      await expect(page.getByRole("heading", { name: "Hotel Aprobado" })).toBeVisible();
    });
  }

  test("desde el directorio, al hacer clic", async ({ page }) => {
    await page.goto("/es/directorio");
    await page.getByRole("heading", { name: "Hotel Aprobado" }).click();
    await expect(page).toHaveURL(/\/es\/negocio\/hotel-aprobado$/);
    await expect(page.getByRole("heading", { name: "Hotel Aprobado" })).toBeVisible();
  });
});

test.describe("botón de WhatsApp", () => {
  test("negocio aprobado redirige a wa.me con el mensaje", async ({ request }) => {
    const response = await request.get("/go/hotel-aprobado?lang=es", { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    const location = response.headers()["location"];
    expect(location).toContain("https://wa.me/573000000002");
    expect(decodeURIComponent(location)).toContain("Hola, te encontré en Visit Barichara");
  });

  test("borrador no redirige a WhatsApp", async ({ request }) => {
    const response = await request.get("/go/hotel-borrador?lang=es", { maxRedirects: 0 });
    expect(response.headers()["location"] ?? "").not.toContain("wa.me");
  });
});

test.describe("demo con contraseña", () => {
  test("sin contraseña no muestra borradores", async ({ page }) => {
    await page.goto("/es/demo");
    await expect(page.getByLabel("Contraseña")).toBeVisible();
    await expect(page.getByText(SECRET)).toHaveCount(0);
  });

  test("contraseña incorrecta", async ({ page }) => {
    await page.goto("/es/demo");
    await page.getByLabel("Contraseña").fill("mala");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Contraseña incorrecta.")).toBeVisible();
    await expect(page.getByText(SECRET)).toHaveCount(0);
  });

  test("contraseña correcta muestra borradores pero no rechazados", async ({ page }) => {
    await page.goto("/es/demo");
    await page.getByLabel("Contraseña").fill("demo-test");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByRole("heading", { name: "Hotel Borrador Secreto" })).toBeVisible();
    await expect(page.getByText("Restaurante Rechazado Secreto")).toHaveCount(0);

    await page.getByRole("heading", { name: "Hotel Borrador Secreto" }).click();
    await expect(page).toHaveURL(/\/es\/demo\/hotel-borrador$/);
    await expect(page.getByRole("heading", { name: "Hotel Borrador Secreto" })).toBeVisible();
  });

  test("la demo no se indexa", async ({ page }) => {
    await page.goto("/es/demo");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
