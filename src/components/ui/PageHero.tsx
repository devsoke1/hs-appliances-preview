import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

/** Navy page header used on every inner page: breadcrumb, eyebrow, H1, intro, actions. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
  aside,
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("hero-wash relative overflow-hidden text-white", className)}>
      <Container className="relative py-8 sm:py-14 lg:py-16">
        <Breadcrumb items={crumbs} />
        <div className={cn("mt-6 grid gap-8 sm:mt-8 lg:gap-10", aside && "lg:grid-cols-12 lg:items-center")}>
          <div className={cn(aside ? "lg:col-span-7" : "max-w-3xl")}>
            {eyebrow && <Eyebrow tone="dark">{eyebrow}</Eyebrow>}
            <h1 className="text-h1 text-white">{title}</h1>
            {intro && <p className="text-lead mt-5 max-w-2xl text-white/75">{intro}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
