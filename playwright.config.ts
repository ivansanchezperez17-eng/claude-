import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// Las pruebas corren el sitio contra tests/mock-supabase.mjs (datos de
// prueba), nunca contra la base real. El build debe hacerse antes con
// NEXT_PUBLIC_SUPABASE_URL apuntando al simulador: ver "npm run test:e2e".
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : undefined,
  },
  projects: [
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: "node tests/mock-supabase.mjs",
      port: 54321,
      reuseExistingServer: false,
    },
    {
      command: `npx next start -p ${PORT}`,
      port: PORT,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      },
    },
  ],
});
