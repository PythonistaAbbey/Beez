import { describe, expect, it } from "vitest";
import en from "@/content/en";
import ar from "@/content/ar";
import { SERVICES } from "@/content/services";
import { TOWER } from "@/content/tower";
import { SLIDES } from "@/content/executive";
import { switchLocalePath } from "@/lib/i18n";

/** Collect every leaf path so we can prove both languages have the same shape. */
function paths(o: unknown, prefix = ""): string[] {
  if (Array.isArray(o)) return o.flatMap((v, i) => paths(v, `${prefix}[${i}]`));
  if (o && typeof o === "object") return Object.entries(o).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  return [prefix];
}
const arabic = /[؀-ۿ]/;

describe("bilingual content", () => {
  it("English and Arabic dictionaries have identical keys", () => {
    expect(paths(ar).sort()).toEqual(paths(en).sort());
  });
  it("service pages and control tower copy match across languages", () => {
    expect(paths(SERVICES.ar).sort()).toEqual(paths(SERVICES.en).sort());
    expect(paths(TOWER.ar).sort()).toEqual(paths(TOWER.en).sort());
    expect(SLIDES.ar.length).toBe(SLIDES.en.length);
  });
  it("Arabic copy is actually Arabic", () => {
    expect(ar.home.title).toMatch(arabic);
    expect(ar.footer.disclaimer).toMatch(arabic);
    expect(SERVICES.ar.medical.lead).toMatch(arabic);
    expect(ar.dir).toBe("rtl");
  });
  it("never claims unverified certifications", () => {
    const all = JSON.stringify([en, SERVICES.en, TOWER.en]);
    for (const banned of ["GDP certified", "HACCP certified", "SFDA licensed", "SFDA-licensed"]) expect(all).not.toContain(banned);
  });
  it("swaps locale in paths", () => {
    expect(switchLocalePath("/en/control-tower", "ar")).toBe("/ar/control-tower");
    expect(switchLocalePath("/ar", "en")).toBe("/en");
  });
});
