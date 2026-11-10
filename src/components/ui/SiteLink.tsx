import Link from "next/link";

/** Paths served by PHP (not Next.js routes): link with a plain <a> so Next doesn't prefetch them (404s). */
const PHP_ROUTE = /^\/(services|insights)(\/|$|\?|#)/;

type Props = React.ComponentProps<typeof Link>;

/** Drop-in replacement for next/link that knows which pages are PHP-rendered. */
export default function SiteLink(props: Props) {
  const href = typeof props.href === "string" ? props.href : "";
  if (PHP_ROUTE.test(href)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { href: _h, prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, onNavigate, ...rest } = props as Props & { onNavigate?: unknown };
    return <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }
  return <Link {...props} />;
}
