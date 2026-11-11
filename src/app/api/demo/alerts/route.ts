import { getDataset } from "@/lib/data/dataset";
import { demoJson } from "../_shared";

export function GET() {
  return demoJson(getDataset().alerts);
}
