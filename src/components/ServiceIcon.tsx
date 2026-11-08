import {
  AirVent, Beer, Container, CookingPot, Flame, Microwave, Milk, Refrigerator, Snowflake,
  Store, Thermometer, UtensilsCrossed, WashingMachine, Warehouse, Wrench, Zap,
  type LucideProps,
} from "lucide-react";

/** Icon by lucide name (as stored in the database `services.icon`). */
const byName: Record<string, React.ComponentType<LucideProps>> = {
  WashingMachine, Refrigerator, Container, UtensilsCrossed, CookingPot, Zap, Flame, Microwave, AirVent,
  Warehouse, Milk, Store, Beer, Thermometer, Snowflake, Wrench,
};

/** Default icon per service slug (used when no icon name is given). */
const bySlug: Record<string, string> = {
  "washing-machine-repair": "WashingMachine",
  "fridge-freezer-repair": "Refrigerator",
  "american-fridge-repair": "Container",
  "dishwasher-repair": "UtensilsCrossed",
  "electric-cooker-repair": "CookingPot",
  "electric-hob-repair": "Zap",
  "gas-cooker-repair": "Flame",
  "gas-hob-repair": "Flame",
  "microwave-repair": "Microwave",
  "air-conditioning-repair": "AirVent",
  "cold-room-repair": "Warehouse",
  "dairy-cabinet-repair": "Milk",
  "display-fridge-repair": "Store",
  "bar-cooler-repair": "Beer",
  "cellar-cooler-repair": "Thermometer",
  "ice-machine-repair": "Snowflake",
};

export function ServiceIcon({ slug, icon, ...props }: { slug?: string; icon?: string | null } & LucideProps) {
  const Icon = byName[icon ?? ""] ?? byName[bySlug[slug ?? ""] ?? ""] ?? Wrench;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
