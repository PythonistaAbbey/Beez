import { planningIndex, quoteSchemas } from "@/lib/schemas";
import { demoJson, readJson } from "../_shared";

/**
 * Validates a quotation request with the same Zod schema as the client and
 * returns a demo reference. Nothing is stored, logged or forwarded.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    return demoJson({ error: "invalid_body" }, { status: 400 });
  }
  const parsed = quoteSchemas().full.safeParse(body);
  if (!parsed.success) return demoJson({ error: "validation", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 422 });
  const ref = `QT-DEMO-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  return demoJson({ reference: ref, planningIndex: planningIndex(parsed.data), stored: false }, { status: 201 });
}
