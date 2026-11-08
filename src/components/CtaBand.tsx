import Link from "next/link";
import { Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";

/** Closing call-to-action band. Use once at the bottom of a page. */
export function CtaBand({
  title = "Appliance playing up?",
  text = "Call us or book online — tell us the make, model and what it's doing.",
  bookHref = "/book/",
}: {
  title?: string;
  text?: string;
  bookHref?: string;
}) {
  return (
    <section className="bg-accent-500">
      <Container className="flex flex-col items-start justify-between gap-6 py-10 sm:py-12 md:flex-row md:items-center">
        <div>
          <p className="font-display text-2xl font-extrabold text-white sm:text-[1.875rem]">{title}</p>
          <p className="mt-1 text-lg text-white/90">{text}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href={telHref} className={buttonClasses("secondary", "lg")}>
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </a>
          <Link href={bookHref} className={buttonClasses("outline-light", "lg", "border-white/70 hover:border-white hover:bg-white/10")}>
            Book a Repair
          </Link>
        </div>
      </Container>
    </section>
  );
}
