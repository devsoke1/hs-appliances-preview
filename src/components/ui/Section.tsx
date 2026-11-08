import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

type Tone = "white" | "mist" | "navy";

const tones: Record<Tone, string> = {
  white: "bg-white",
  mist: "bg-mist",
  navy: "bg-navy-900 text-white/80 [&_h2]:text-white [&_h3]:text-white",
};

export function Section({
  tone = "white",
  id,
  className,
  children,
}: {
  tone?: Tone;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 lg:mb-14",
        align === "center" ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2 className="text-h2">{title}</h2>
        {intro && <p className={cn("text-lead mt-4", tone === "dark" ? "text-white/70" : "text-muted")}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
