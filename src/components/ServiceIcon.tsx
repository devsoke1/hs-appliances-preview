import {
  AirVent, Beer, CookingPot, Flame, Microwave, Milk, Refrigerator, Snowflake,
  Store, Thermometer, UtensilsCrossed, WashingMachine, Warehouse, Wrench, Zap, Container,
  type LucideProps,
} from "lucide-react";

const map: Record<string, React.ComponentType<LucideProps>> = {
  "washing-machine-repair": WashingMachine,
  "fridge-freezer-repair": Refrigerator,
  "american-fridge-repair": Container,
  "dishwasher-repair": UtensilsCrossed,
  "electric-cooker-repair": CookingPot,
  "electric-hob-repair": Zap,
  "gas-cooker-repair": Flame,
  "gas-hob-repair": Flame,
  "microwave-repair": Microwave,
  "air-conditioning-repair": AirVent,
  "cold-room-repair": Warehouse,
  "dairy-cabinet-repair": Milk,
  "display-fridge-repair": Store,
  "bar-cooler-repair": Beer,
  "cellar-cooler-repair": Thermometer,
  "ice-machine-repair": Snowflake,
};

export function ServiceIcon({ slug, ...props }: { slug: string } & LucideProps) {
  const Icon = map[slug] ?? Wrench;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
