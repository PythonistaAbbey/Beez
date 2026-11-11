import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["", "/about", "/logistics", "/cold-chain", "/medical", "/warehousing", "/fourth-party-logistics", "/ecommerce", "/technology", "/tracking", "/corporate", "/quote", "/support", "/control-tower", "/executive"];

test.describe("public site", () => {
  for (const locale of ["en", "ar"] as const) {
    test(`all ${PAGES.length} pages render with the concept disclaimer (${locale})`, async ({ page }) => {
      for (const p of PAGES) {
        const res = await page.goto(`/${locale}${p}`);
        expect(res?.status(), `${locale}${p}`).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
        await expect(page.getByRole("note").first()).toBeVisible();
        await expect(page.locator("#disclaimer")).toHaveCount(1);
      }
    });
  }

  test("root redirects to English and the language switch keeps the page", async ({ page, isMobile }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/precision in every delivery/i);
    await page.goto("/en/medical");
    await page.getByRole("link", { name: /switch to arabic/i }).click();
    await expect(page).toHaveURL(/\/ar\/medical$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("عناية");
    if (isMobile) return;
  });

  test("mobile menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/en");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#mobile-nav").getByRole("link", { name: "Warehousing" }).click();
    await expect(page).toHaveURL(/\/en\/warehousing$/);
  });

  test("no horizontal overflow on key pages", async ({ page }) => {
    for (const p of ["/en", "/ar", "/en/control-tower", "/en/quote", "/ar/control-tower?tab=continuity"]) {
      await page.goto(p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, p).toBeLessThanOrEqual(1);
    }
  });

  test("source links point to beez.com.sa public pages", async ({ page }) => {
    await page.goto("/en/technology");
    const hrefs = await page.locator('main a[href^="https://beez.com.sa"]').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    expect(hrefs.length).toBeGreaterThan(2);
  });
});

test.describe("accessibility (axe, WCAG 2 A/AA)", () => {
  for (const p of ["/en", "/ar", "/en/cold-chain", "/en/tracking", "/en/quote", "/en/support", "/en/control-tower", "/ar/control-tower?tab=continuity", "/en/executive"]) {
    test(`no serious violations on ${p}`, async ({ page }) => {
      await page.goto(p);
      await page.waitForTimeout(400);
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
});
