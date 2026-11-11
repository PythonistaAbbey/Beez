import {
  Activity, BarChart3, BellRing, Boxes, Building2, Circle, Cpu, FileCheck, Handshake, HeartPulse, Layers, Lock,
  MapPin, MessageSquare, Network, Package, Plug, Route, ShieldCheck, ShoppingCart, Siren, Snowflake, Sun,
  Thermometer, Truck, Users, Warehouse, type LucideProps,
} from "lucide-react";

const ICONS = {
  Activity, BarChart3, BellRing, Boxes, Building2, Cpu, FileCheck, Handshake, HeartPulse, Layers, Lock, MapPin,
  MessageSquare, Network, Package, Plug, Route, ShieldCheck, ShoppingCart, Siren, Snowflake, Sun, Thermometer,
  Truck, Users, Warehouse,
} as const;

/** Render an icon by name (content files reference icons as strings). Decorative by default. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = (ICONS as Record<string, typeof Circle>)[name] ?? Circle;
  return <C aria-hidden="true" strokeWidth={1.75} {...props} />;
}
