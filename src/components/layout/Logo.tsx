import Link from "@/components/ui/SiteLink";
import { cn } from "@/lib/cn";
import { publicPath } from "@/lib/public-path";

/** Light wordmark for white headers, white wordmark for navy footer. Source: assets/brand/HS-Appliances-Logo.pdf */
const SRC = {
  dark: "/images/logo.png",
  light: "/images/logo-on-dark.png",
} as const;

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex min-h-11 shrink-0 items-center", className)}>
      <img
        src={publicPath(SRC[tone])}
        alt="HS Appliances"
        width={2411}
        height={395}
        className="h-9 w-auto sm:h-10 lg:h-11"
      />
    </Link>
  );
}
