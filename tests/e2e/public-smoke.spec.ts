import { expect, test as base } from "@playwright/test";

type Diagnostic = {
  kind: "pageerror" | "console" | "requestfailed" | "badresponse";
  firstParty?: boolean;
  resourceType?: string;
  status?: number;
  url?: string;
  message: string;
  expectedReason?: string;
};

type BrowserDiagnostics = {
  entries: Diagnostic[];
  failures: Diagnostic[];
};

function safeURL(value: string, origin: string): string {
  try {
    const url = new URL(value, origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value;
  }
}

const test = base.extend<{ browserDiagnostics: BrowserDiagnostics }>({
  browserDiagnostics: [async ({ page, baseURL }, use, testInfo) => {
    const origin = new URL(baseURL ?? "http://127.0.0.1:3100").origin;
    const diagnostics: BrowserDiagnostics = { entries: [], failures: [] };
    const isFirstParty = (value: string) => {
      try {
        const url = new URL(value, origin);
        return url.origin === origin || url.protocol === "webpack-internal:";
      } catch {
        return true;
      }
    };

    page.on("pageerror", (error) => {
      const entry: Diagnostic = { kind: "pageerror", message: error.message };
      diagnostics.entries.push(entry);
      diagnostics.failures.push(entry);
    });

    page.on("console", (message) => {
      if (message.type() !== "error") return;
      const location = message.location().url;
      const firstParty = !location || isFirstParty(location);
      const expectedReason = message.text().includes(
        "The Content Security Policy directive 'upgrade-insecure-requests' is ignored when delivered in a report-only policy.",
      )
        ? "Non-blocking browser notice for the report-only CSP policy"
        : undefined;
      const entry: Diagnostic = {
        kind: "console",
        firstParty,
        ...(location ? { url: safeURL(location, origin) } : {}),
        message: message.text(),
        ...(expectedReason ? { expectedReason } : {}),
      };
      diagnostics.entries.push(entry);
      if (firstParty && !expectedReason) diagnostics.failures.push(entry);
    });

    page.on("requestfailed", (request) => {
      const firstParty = isFirstParty(request.url());
      const errorText = request.failure()?.errorText ?? "Request failed";
      let expectedReason: string | undefined;
      if (firstParty && request.resourceType() === "fetch" && errorText === "net::ERR_ABORTED") {
        if (new URL(request.url()).pathname === new URL(page.url()).pathname) {
          expectedReason = "Route data fetch was canceled during the matching client-side navigation";
        }
      }
      const entry: Diagnostic = {
        kind: "requestfailed",
        firstParty,
        resourceType: request.resourceType(),
        url: safeURL(request.url(), origin),
        message: errorText,
        ...(expectedReason ? { expectedReason } : {}),
      };
      diagnostics.entries.push(entry);
      if (
        firstParty
        && !expectedReason
        && ["document", "script", "stylesheet", "xhr", "fetch"].includes(request.resourceType())
      ) {
        diagnostics.failures.push(entry);
      }
    });

    page.on("response", (response) => {
      const request = response.request();
      if (response.status() < 400
        || !["document", "script", "stylesheet", "xhr", "fetch"].includes(request.resourceType())) {
        return;
      }

      const firstParty = isFirstParty(response.url());
      const entry: Diagnostic = {
        kind: "badresponse",
        firstParty,
        resourceType: request.resourceType(),
        status: response.status(),
        url: safeURL(response.url(), origin),
        message: firstParty
          ? "First-party rendering or API resource returned an error status"
          : "External resource returned an error status",
      };
      diagnostics.entries.push(entry);
      if (firstParty) diagnostics.failures.push(entry);
    });

    await use(diagnostics);

    const finalPath = new URL(page.url()).pathname;
    for (const entry of diagnostics.failures) {
      if (
        entry.kind === "requestfailed"
        && entry.firstParty
        && entry.resourceType === "fetch"
        && entry.message === "net::ERR_ABORTED"
        && entry.url
        && new URL(entry.url).pathname === finalPath
      ) {
        entry.expectedReason = "Route data fetch was canceled during the matching client-side navigation";
      }
    }
    diagnostics.failures = diagnostics.failures.filter((entry) => !entry.expectedReason);

    await testInfo.attach("browser-diagnostics.json", {
      body: Buffer.from(JSON.stringify(diagnostics.entries, null, 2)),
      contentType: "application/json",
    });
    expect(
      diagnostics.failures,
      `Unexpected first-party browser failures in ${testInfo.title}; inspect browser-diagnostics.json`,
    ).toEqual([]);
  }, { auto: true }],
});

const publicRoutes = [
  { path: "/", heading: /Modern Enterprise/ },
  { path: "/about", heading: /Business intelligence before automation/ },
  { path: "/platform", heading: /One intelligence layer for signals/ },
  { path: "/demo-platform", heading: /Executive Command Center/ },
  { path: "/demo-platform/executive", heading: /Executive Command Center/ },
] as const;

const viewportWidths = [375, 390, 1440] as const;

function normalizedPath(value: string): string {
  const path = new URL(value).pathname;
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

test.describe("public route rendering", () => {
  for (const route of publicRoutes) {
    test(`${route.path} renders its main content without redirect`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: "load" });

      expect(response, `${route.path} should return a document response`).not.toBeNull();
      expect(response!.status(), `${route.path} document response`).toBeLessThan(400);
      await expect(page.getByRole("main").getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
      expect(normalizedPath(page.url()), `${route.path} should not redirect`).toBe(route.path);
    });
  }
});

test.describe("responsive layout geometry", () => {
  for (const route of publicRoutes) {
    for (const width of viewportWidths) {
      test(`${route.path} fits at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route.path, { waitUntil: "load" });
        await expect(page.getByRole("main").getByRole("heading", { level: 1, name: route.heading })).toBeVisible();

        const layout = await page.evaluate(() => {
          const tolerance = 2;
          const main = document.querySelector("main");
          const selector = "h1, h2, button, a[href], input, select, textarea, [role='button'], [role='img'], section[class*='rounded'], article[class*='rounded']";
          const outOfBounds = Array.from(main?.querySelectorAll<HTMLElement>(selector) ?? [])
            .filter((element) => {
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              let ancestor = element.parentElement;
              let insideHorizontalScroller = false;
              while (ancestor && ancestor !== main) {
                const ancestorStyle = window.getComputedStyle(ancestor);
                if (
                  ["auto", "scroll"].includes(ancestorStyle.overflowX)
                  && ancestor.scrollWidth > ancestor.clientWidth + tolerance
                ) {
                  insideHorizontalScroller = true;
                  break;
                }
                ancestor = ancestor.parentElement;
              }

              return style.display !== "none"
                && style.visibility !== "hidden"
                && rect.width > 0
                && rect.height > 0
                && !insideHorizontalScroller
                && (rect.left < -tolerance || rect.right > window.innerWidth + tolerance);
            })
            .slice(0, 12)
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                tag: element.tagName.toLowerCase(),
                label: (element.getAttribute("aria-label") || element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 90),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
              };
            });

          return {
            viewportWidth: window.innerWidth,
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            outOfBounds,
          };
        });

        expect(
          layout.scrollWidth,
          `${route.path} at ${width}px has horizontal document overflow: ${JSON.stringify(layout)}`,
        ).toBeLessThanOrEqual(layout.clientWidth + 2);
        expect(
          layout.outOfBounds,
          `${route.path} at ${width}px has visible content outside the viewport: ${JSON.stringify(layout.outOfBounds)}`,
        ).toEqual([]);
      });
    }
  }
});

test("desktop primary navigation links target the intended public routes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const navigation = page.getByRole("navigation", { name: "Global navigation" });
  await expect(navigation).toBeVisible();
  const links = navigation.getByRole("link");
  const hrefs = await links.evaluateAll((items) => items.map((item) => (item as HTMLAnchorElement).getAttribute("href")));

  expect(hrefs).toEqual(["/", "/platform", "/architecture", "/products", "/resources", "/about"]);
  for (const href of hrefs) {
    expect(href).toMatch(/^\/[a-z0-9/-]*$/);
  }
});

test("mobile navigation traps keyboard focus, closes with Escape, and activates a route by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const analyticsChoices = page.getByRole("region", { name: "Analytics privacy choices" });
  await expect(analyticsChoices).toBeVisible();
  await analyticsChoices.getByRole("button", { name: "Keep analytics off" }).click();
  await expect(analyticsChoices).toBeHidden();

  const openButton = page.getByRole("button", { name: "Open navigation menu" });
  await expect(openButton).toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
  await openButton.press("Enter");

  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(menu).toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "true");
  const closeButton = menu.getByRole("button", { name: "Close navigation menu" });
  const menuLinks = menu.getByRole("link");
  const lastLink = menuLinks.last();
  const expectFocusInMenu = async () => {
    await expect.poll(() => menu.evaluate((dialog) => dialog.contains(document.activeElement))).toBe(true);
  };

  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(lastLink).toBeFocused();
  await expectFocusInMenu();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  for (let index = 0; index < 6; index += 1) {
    await page.keyboard.press("Tab");
    await expect(menuLinks.nth(index)).toBeFocused();
  }
  await page.keyboard.press("Tab");
  await expectFocusInMenu();
  await page.keyboard.press("Tab");
  await expect(lastLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(openButton).toBeFocused();

  await openButton.press("Enter");
  const reopenedMenu = page.getByRole("dialog", { name: "Navigation menu" });
  const reopenedLinks = reopenedMenu.getByRole("link");
  const reopenedLinkNames = await reopenedLinks.allTextContents();
  const aboutIndex = reopenedLinkNames.findIndex((name) => name.trim() === "About");
  const aboutLink = reopenedMenu.getByRole("link", { name: "About", exact: true });
  expect(aboutIndex, "About should be a link in the reopened mobile menu").toBeGreaterThan(0);
  await expect(reopenedMenu.getByRole("button", { name: "Close navigation menu" })).toBeFocused();
  for (let index = 0; index <= aboutIndex; index += 1) {
    await page.keyboard.press("Tab");
  }
  await expect(aboutLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("main").getByRole("heading", { level: 1, name: /Business intelligence before automation/ })).toBeVisible();
});

test("public demo controls filter synthetic opportunities and answer locally", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo-platform");

  const demoNotice = page.getByRole("note").filter({ hasText: "Demo preview · synthetic sample data" });
  await expect(demoNotice).toContainText("local previews only");
  await expect(page.getByRole("img", { name: /sample eight-period trend/ }).first()).toBeVisible();
  await page.getByLabel("Priority lens · demo role").selectOption("CFO");
  await expect(page.getByText(/^Selected · Finance\./)).toBeVisible();

  const pipelineFilter = page.getByRole("group", { name: "Filter sample opportunities by pipeline stage" });
  const proposalStage = pipelineFilter.getByRole("button", { name: /Proposal/ });
  await proposalStage.click();
  await expect(proposalStage).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Sample Opportunity A")).toBeVisible();
  await expect(page.getByText("Sample Opportunity C")).toBeHidden();
  await page.getByRole("button", { name: "Clear stage" }).click();
  await expect(page.getByText("Sample Opportunity C")).toBeVisible();

  await page.getByRole("button", { name: "Ask AIOS · demo" }).click();
  await page.getByRole("button", { name: "What is the pipeline bottleneck?" }).click();
  await expect(page.getByText(/^The synthetic pipeline is 37,6\s*Mio\./)).toBeVisible();
  await expect(page.getByText(/Answers are generated locally from the synthetic dashboard state/)).toBeVisible();
  expect(normalizedPath(page.url())).toBe("/demo-platform");
});
