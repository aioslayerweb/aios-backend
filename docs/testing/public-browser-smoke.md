# Public website browser smoke tests

The Playwright smoke suite exercises the public website and synthetic demo in Chromium. It checks route rendering, responsive DOM geometry, public navigation, representative demo controls, and first-party browser errors. It does not prove tenant isolation, database security, or production readiness.

## Local run

Prerequisites: Node.js 20 or newer, npm dependencies installed, and the Playwright Chromium browser binary.

```sh
npm install
npx playwright install chromium
npm run test:e2e:smoke
```

The default command starts the local Next.js development server on `127.0.0.1:3100` and stops it when the run finishes. Browser binaries are installed explicitly; application builds and deployments do not install them. Playwright traces, screenshots, videos, and HTML reports are written to ignored `test-results/` and `playwright-report/` directories.

## Explicit base URL

For an already-running local server, set `PLAYWRIGHT_BASE_URL` to its origin. An explicit base URL disables automatic server startup. A non-loopback target is rejected unless `PLAYWRIGHT_ALLOW_REMOTE=1` is also set. Set that flag only after separately authorizing a read-only public-site smoke test against the exact target.

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e:smoke
```

Do not use production credentials or submit business forms. The suite only navigates public pages and exercises controls whose inspected implementation is synthetic/local-only. Do not treat browser checks as proof of backend tenant isolation.

## Coverage

The suite checks `/`, `/about`, `/platform`, `/demo-platform`, and `/demo-platform/executive` at widths 375px, 390px, and 1440px. It verifies mobile-menu keyboard/focus behavior, desktop navigation destinations, the executive demo’s synthetic opportunity filter, role lens, local assistant, and sample chart. Horizontal content inside an explicitly scrollable region is excluded from viewport-edge checks; document-level horizontal overflow is still checked. The suite never opts into optional analytics; the mobile-menu test explicitly selects “Keep analytics off” to clear the privacy prompt. First-party document/script/style/API failures and uncaught application errors fail the test. Console errors and failed requests from both first- and third-party origins are attached to each test result; known non-blocking report-only CSP notices and matching route-data fetch cancellations are labeled rather than hidden. Chromium uses its default motion preference; reduced-motion behavior is not covered.
