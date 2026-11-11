import { z } from "zod";
import type { Dict } from "@/content/en";
import type { CityId, Industry } from "@/lib/data/types";

export const CITY_IDS = ["riyadh", "jeddah", "dammam", "makkah", "madinah", "tabuk", "abha", "buraidah", "hail", "jazan", "taif", "hofuf", "najran", "sakaka"] as const satisfies readonly CityId[];
export const INDUSTRY_IDS = ["medical", "food", "cosmetics", "ecommerce", "beverage", "retail", "supplements"] as const satisfies readonly Industry[];
export const SERVICE_IDS = ["cold_chain", "warehousing", "last_mile", "b2b", "fourth_party", "ecommerce"] as const;
export const PROFILE_IDS = ["pharma", "fresh", "controlled"] as const;

/** Saudi mobile or landline in international or local form. */
export const SAUDI_PHONE = /^(?:\+?966|0)?(?:5\d{8}|1\d{7,8}|800\d{7})$/;

type QuoteMsgs = Dict["quote"]["errors"];

const DEFAULT_MSGS: QuoteMsgs = {
  company: "company", contactName: "contactName", email: "email", phone: "phone", pallets: "pallets",
  startDate: "startDate", consent: "consent", sameCity: "sameCity",
};

/** Step 1 and step 2 schemas are exported separately so each wizard step validates on its own. */
export function quoteSchemas(m: QuoteMsgs = DEFAULT_MSGS) {
  const company = z.object({
    company: z.string().trim().min(2, m.company).max(120, m.company),
    contactName: z.string().trim().min(2, m.contactName).max(80, m.contactName),
    email: z.string().trim().email(m.email).max(160, m.email),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s-]/g, ""))
      .refine((v) => v === "" || SAUDI_PHONE.test(v), m.phone)
      .optional(),
  });
  const shipment = z.object({
    service: z.enum(SERVICE_IDS),
    industry: z.enum(INDUSTRY_IDS),
    origin: z.enum(CITY_IDS),
    destination: z.enum(CITY_IDS),
    profile: z.enum(PROFILE_IDS),
    palletsPerMonth: z.coerce.number({ message: m.pallets }).int(m.pallets).min(1, m.pallets).max(5000, m.pallets),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, m.startDate),
    notes: z.string().trim().max(1000).optional(),
  });
  const review = z.object({ consent: z.literal(true, { message: m.consent }) });
  const full = company.merge(shipment).merge(review);
  return { company, shipment, review, full };
}

export type QuoteInput = z.input<ReturnType<typeof quoteSchemas>["full"]>;
export type QuoteData = z.output<ReturnType<typeof quoteSchemas>["full"]>;

/** Illustrative planning index (NOT a price). Pure so it can be unit tested. */
export function planningIndex(q: Pick<QuoteData, "palletsPerMonth" | "profile" | "service" | "origin" | "destination">) {
  const profileFactor = { pharma: 1.35, fresh: 1.15, controlled: 1 }[q.profile];
  const serviceFactor = { cold_chain: 1, warehousing: 0.8, last_mile: 1.2, b2b: 0.95, fourth_party: 1.3, ecommerce: 1.1 }[q.service];
  const sameCity = q.origin === q.destination;
  const volumeDiscount = q.palletsPerMonth >= 500 ? 0.85 : q.palletsPerMonth >= 100 ? 0.92 : 1;
  const base = 100 * profileFactor * serviceFactor * volumeDiscount * (sameCity ? 0.7 : 1);
  return { low: Math.round(base * 0.9), high: Math.round(base * 1.15) };
}

export function ticketSchema(m: Dict["support"]["errors"] = { subject: "subject", description: "description", shipmentId: "shipmentId" }) {
  return z.object({
    category: z.enum(["damage", "delay", "temperature", "billing", "other"]),
    shipmentId: z
      .string()
      .trim()
      .toUpperCase()
      .refine((v) => v === "" || /^DEMO-[A-Z]{2}-\d{4}$/.test(v), m.shipmentId)
      .optional(),
    subject: z.string().trim().min(3, m.subject).max(120, m.subject),
    description: z.string().trim().min(10, m.description).max(2000, m.description),
  });
}
export type TicketInput = z.infer<ReturnType<typeof ticketSchema>>;

export const TRACKING_ID = /^DEMO-[A-Z]{2}-\d{4}$/;

export const NOTIFY_EVENTS = ["temp_excursion", "delay", "delivered", "exception", "stock_low"] as const;
export const NOTIFY_CHANNELS = ["email", "sms", "whatsapp", "inapp"] as const;
const channels = z.array(z.enum(NOTIFY_CHANNELS)).or(z.literal(false).transform(() => [] as ("email" | "sms" | "whatsapp" | "inapp")[]));
export const notificationPrefsSchema = z.object({
  matrix: z.object(Object.fromEntries(NOTIFY_EVENTS.map((e) => [e, channels])) as Record<(typeof NOTIFY_EVENTS)[number], typeof channels>),
  quietFrom: z.string().regex(/^\d{2}:\d{2}$/),
  quietTo: z.string().regex(/^\d{2}:\d{2}$/),
  contact: z.string().trim().email().or(z.literal("")),
  language: z.enum(["en", "ar"]),
});
export type NotificationPrefs = z.input<typeof notificationPrefsSchema>;
