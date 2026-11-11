import { ticketSchema } from "@/lib/schemas";
import { demoJson, readJson } from "../_shared";

/** Validates a demo support ticket. Nothing is stored or sent. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    return demoJson({ error: "invalid_body" }, { status: 400 });
  }
  const parsed = ticketSchema().safeParse(body);
  if (!parsed.success) return demoJson({ error: "validation", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  return demoJson({ id: `TCK-DEMO-${Math.floor(400 + Math.random() * 500)}`, state: "open", stored: false }, { status: 201 });
}
