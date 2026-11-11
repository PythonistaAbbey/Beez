import { expect, test } from "@playwright/test";

test.describe("customer workflows", () => {
  test("track a demo shipment and see the excursion, timeline and report link", async ({ page }) => {
    await page.goto("/en/tracking");
    await page.getByLabel("Shipment ID").fill("demo-rx-1042");
    await page.getByRole("button", { name: "Track", exact: true }).click();
    const result = page.getByTestId("tracking-result");
    await expect(result).toBeVisible();
    await expect(result.getByText("DEMO-RX-1042")).toBeVisible();
    await expect(result.getByText(/readings outside the band/)).toBeVisible();
    await expect(page).toHaveURL(/id=DEMO-RX-1042/);
    await page.getByLabel("Shipment ID").fill("ABC");
    await page.getByRole("button", { name: "Track", exact: true }).click();
    await expect(page.locator("#track-err")).toContainText("DEMO-XX-0000");
  });

  test("corporate quote: validation, three steps, demo submission", async ({ page }) => {
    await page.goto("/en/quote");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Enter your company name")).toBeVisible();
    await page.getByLabel("Company name").fill("Acme Pharma (test)");
    await page.getByLabel("Contact name").fill("Test User");
    await page.getByLabel("Work email").fill("test@example.com");
    await page.getByLabel("Phone (optional)").fill("0551234567");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("Pallets per month").fill("120");
    await page.getByLabel("Desired start date").fill("2027-03-01");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Review your request")).toBeVisible();
    await page.getByRole("button", { name: "Submit demo request" }).click();
    await expect(page.getByText("Please confirm you understand this is a demo")).toBeVisible();
    await page.getByLabel(/I understand this is a demonstration/).check();
    await page.getByRole("button", { name: "Submit demo request" }).click();
    await expect(page.getByTestId("quote-success")).toContainText(/QT-DEMO-/);
  });

  test("report a delivery issue and get a simulated reply", async ({ page }) => {
    await page.goto("/en/support?shipment=DEMO-FD-2210");
    await expect(page.getByLabel("Shipment ID (optional)")).toHaveValue("DEMO-FD-2210");
    await page.getByLabel("Subject").fill("Late arrival");
    await page.getByLabel("Describe what happened").fill("short");
    await page.getByRole("button", { name: "Create demo ticket" }).click();
    await expect(page.getByText(/at least 10 characters/)).toBeVisible();
    await page.getByLabel("Describe what happened").fill("The delivery arrived two hours after the window.");
    await page.getByRole("button", { name: "Create demo ticket" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Demo ticket created" })).toBeVisible();
    await expect(page.getByText(/Simulated reply/)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("control tower", () => {
  test("inspect a shipment, switch to table view, capture proof of delivery", async ({ page }) => {
    await page.goto("/en/control-tower?tab=shipments");
    await page.getByRole("button", { name: "DEMO-RX-1063" }).click();
    const dlg = page.getByRole("dialog");
    await expect(dlg).toBeVisible();
    await dlg.getByRole("button", { name: "Show as table" }).click();
    await expect(dlg.getByRole("table")).toBeVisible();
    await dlg.getByRole("checkbox", { name: /Sign here/ }).check();
    await dlg.getByRole("button", { name: "Capture demo POD" }).click();
    await expect(dlg.getByText("Proof of delivery", { exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dlg).toBeHidden();
  });

  test("acknowledge and escalate a critical alert with audit trail", async ({ page }) => {
    await page.goto("/en/control-tower?tab=alerts");
    const first = page.locator('[data-testid^="alert-"]').first();
    await first.getByRole("button", { name: "Acknowledge" }).click();
    await expect(first.getByText("Acknowledged", { exact: true })).toBeVisible();
    await first.getByRole("button", { name: "Escalate" }).click();
    const dlg = page.getByRole("dialog");
    await dlg.getByLabel(/Level 2/).check();
    await dlg.getByLabel("Note for the receiving team").fill("Please call the receiving pharmacy.");
    await dlg.getByRole("button", { name: "Confirm escalation" }).click();
    await expect(first.getByText(/Escalated · L2/)).toBeVisible();
    await first.getByText(/Activity/).click();
    await expect(first.getByText(/Please call the receiving pharmacy/)).toBeVisible();
  });

  test("continuity: run scenario, compare alternatives, request transfer", async ({ page }) => {
    await page.goto("/en/control-tower?tab=continuity");
    await expect(page.getByText(/Training simulation/)).toBeVisible();
    await page.getByTestId("run-vehicle").click();
    await expect(page.getByText(/standby vehicle requested/)).toBeVisible();
    await page.getByTestId("delayed-DEMO-RX-1071").getByRole("button").click();
    await page.locator("tr", { hasText: "Swap to standby vehicle" }).getByRole("button", { name: "Choose" }).click();
    await expect(page.locator("tr", { hasText: "Swap to standby vehicle" }).getByText("Plan recorded (simulation)")).toBeVisible();
    await page.getByRole("button", { name: "Request transfer" }).first().click();
    await expect(page.locator("main").getByText("Transfer requested (demo)").first()).toBeVisible();
  });

  test("tabs are keyboard operable and the clock runs", async ({ page }) => {
    await page.goto("/en/control-tower");
    const clock = page.getByTestId("sim-clock");
    const t0 = await clock.textContent();
    await page.getByRole("tab", { name: "Overview" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("tab", { name: "Shipments" })).toHaveAttribute("aria-selected", "true");
    await expect(page).toHaveURL(/tab=shipments/);
    await expect(clock).not.toHaveText(t0 ?? "", { timeout: 15_000 });
  });

  test("notification preferences validate and save", async ({ page }) => {
    await page.goto("/en/control-tower?tab=notifications");
    await page.getByLabel("Escalation contact email").fill("bad");
    await page.getByRole("button", { name: "Save preferences" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
    await page.getByLabel("Escalation contact email").fill("qa@example.com");
    await page.getByRole("checkbox", { name: "Low stock – WhatsApp" }).check();
    await page.getByRole("button", { name: "Save preferences" }).click();
    await expect(page.locator("form").getByText(/Preferences saved/)).toBeVisible();
  });

  test("Arabic control tower is RTL with Arabic labels", async ({ page }) => {
    await page.goto("/ar/control-tower?tab=continuity");
    await expect(page.getByRole("heading", { name: "برج التحكم" })).toBeVisible();
    await expect(page.getByText(/محاكاة تدريبية/)).toBeVisible();
  });
});

test("executive demo mode navigates with the keyboard", async ({ page }) => {
  await page.goto("/en/executive");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/precision in every delivery/i);
  // Retry until hydration has attached the key handler.
  await expect(async () => {
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/scattered customer story/, { timeout: 1000 });
  }).toPass();
  await page.keyboard.press("n");
  await expect(page.getByText(/Speaker notes:/)).toBeVisible();
});

test("mock API marks every response as synthetic and rejects bad input", async ({ request }) => {
  const r = await request.get("/api/demo/shipments/DEMO-RX-1042");
  expect(r.headers()["x-demo-data"]).toBe("synthetic");
  expect((await r.json()).demo).toBe(true);
  expect((await request.get("/api/demo/shipments/123")).status()).toBe(400);
  expect((await request.post("/api/demo/quotes", { data: { company: "x" } })).status()).toBe(422);
});
