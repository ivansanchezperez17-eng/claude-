import { expect, test, type Page } from "@playwright/test";

test.describe("precios", () => {
  test("en español: solo pesos colombianos", async ({ page }) => {
    await page.goto("/es/negocio/hotel-aprobado");
    await expect(page.getByText("Desde $414.000 COP por noche")).toBeVisible();
    await expect(page.getByText(/US\$|USD/)).toHaveCount(0);
  });

  test("en inglés: pesos + aproximado en dólares", async ({ page }) => {
    await page.goto("/en/negocio/hotel-aprobado");
    await expect(page.getByText("From COP 414,000 per night")).toBeVisible();
    // 414.000 / 3.210 ≈ 129
    await expect(page.getByText("≈ $129, approximate")).toBeVisible();
  });

  test("tarjetas del directorio en pesos", async ({ page }) => {
    await page.goto("/es/directorio");
    await expect(page.getByText("Desde $80.000 COP por persona")).toBeVisible();
  });
});

test.describe("hero solo de Barichara", () => {
  for (const locale of ["es", "en"]) {
    test(`/${locale} sin cañones ni cascadas`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const hero = page.locator("section").first();
      await expect(hero).not.toContainText(/cañon|cascada|canyon|waterfall/i);
      await expect(hero).toContainText(/Camino Real/);
    });
  }
});

async function internalLinks(page: Page) {
  const hrefs = await page.locator("a[href]").evaluateAll((anchors) =>
    anchors.map((a) => a.getAttribute("href") ?? ""),
  );
  return [...new Set(hrefs)].filter(
    (h) => h.startsWith("/") && !h.startsWith("/go/") && !h.startsWith("//"),
  );
}

test.describe("enlaces internos", () => {
  for (const locale of ["es", "en"]) {
    test(`todos responden y se quedan en /${locale}`, async ({ page, request }) => {
      const pages = [`/${locale}`, `/${locale}/directorio`, `/${locale}/negocio/hotel-aprobado`];
      const checked = new Set<string>();
      for (const url of pages) {
        await page.goto(url);
        for (const href of await internalLinks(page)) {
          const path = href.split("#")[0];
          if (!path || checked.has(path)) continue;
          checked.add(path);
          expect(path, `${href} en ${url} cambia de idioma`).toMatch(
            new RegExp(`^/${locale}(/|$|\\?)`),
          );
          const response = await request.get(path);
          expect(response.status(), `${href} en ${url}`).toBeLessThan(400);
        }
      }
      expect(checked.size).toBeGreaterThan(5);
    });
  }

  test("buscador del inicio en inglés se queda en inglés", async ({ page }) => {
    await page.goto("/en");
    await page.getByPlaceholder("Search a hotel, restaurant or shop").fill("Hotel");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/en\/directorio\?q=Hotel/);
  });
});
