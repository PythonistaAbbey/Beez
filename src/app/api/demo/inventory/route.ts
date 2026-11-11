import { INVENTORY, WAREHOUSES } from "@/lib/data/dataset";
import { demoJson } from "../_shared";

export function GET() {
  return demoJson({ warehouses: WAREHOUSES, inventory: INVENTORY });
}
