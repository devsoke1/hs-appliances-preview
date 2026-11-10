import Link from "@/components/ui/SiteLink";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-display font-bold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /** Orange — the ONE action we want (Book / Call). Use once or twice per view. */
  primary: "bg-accent-600 text-white shadow-[0_1px_0_rgb(0_0_0/0.08),0_6px_16px_-6px_rgb(242_92_0/0.5)] hover:bg-accent-700",
  secondary: "bg-navy-900 text-white hover:bg-navy-700",
  outline: "border-2 border-navy-900/15 bg-white text-navy-900 hover:border-navy-900/40",
  "outline-light": "border-2 border-white/25 text-white hover:border-white/60 hover:bg-white/5",
  ghost: "text-navy-900 hover:bg-navy-900/5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

type Props = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** Link-styled button. External/tel/mailto use <a>, internal routes use next/link. */
export function Button({ href, variant = "primary", size = "md", className, children, ...rest }: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  const isRaw = /^(tel:|mailto:|https?:)/.test(href);
  if (isRaw) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export const buttonClasses = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(base, variants[variant], sizes[size], className);
