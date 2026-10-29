import { defineConfig, devices } from "@playwright/test";

const explicitBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = explicitBaseURL ?? "http://127.0.0.1:3100";
const base = new URL(baseURL);
const isLoopback = ["localhost", "127.0.0.1", "::1"].includes(base.hostname);

if (!isLoopback && process.env.PLAYWRIGHT_ALLOW_REMOTE !== "1") {
  throw new Error(
    "Remote browser tests require an explicitly authorized target: set PLAYWRIGHT_ALLOW_REMOTE=1 only for an approved read-only public-site smoke test.",
  );
}

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "public-smoke.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  outputDir: "test-results",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  ...(explicitBaseURL
    ? {}
    : {
        webServer: {
          command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
