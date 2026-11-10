import Link from "@/components/ui/SiteLink";
import { Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { imagePath, siteImages } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";

/** Closing call-to-action band. Mirrored in PHP: components.php → cta_band(). */
export function CtaBand({
  title = "Appliance playing up?",
  text = "Call us or book online — tell us the make, model and what it's doing.",
  bookHref = "/book/",
}: {
  title?: string;
  text?: string;
  bookHref?: string;
}) {
  const img = siteImages.cta;
  return (
    <section className="overflow-hidden bg-accent-600">
      <Container className="flex flex-col items-start justify-between gap-6 py-10 sm:py-12 md:flex-row md:items-center">
        <div className="flex items-center gap-8">
          {img && (
            <div className="hidden aspect-[4/3] w-44 shrink-0 overflow-hidden rounded-[var(--radius-card)] ring-4 ring-white/20 lg:block">
              <SmartImage src={imagePath(img.name, 400)} alt="" sizes="176px" />
            </div>
          )}
          <div>
            <p className="font-display text-2xl font-extrabold text-white sm:text-[1.875rem]">{title}</p>
            <p className="mt-1 text-lg text-white">{text}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <a href={telHref} className={buttonClasses("secondary", "lg")}>
            <Phone className="size-5" aria-hidden /> {business.phone.display}
          </a>
          <Link href={bookHref} className={buttonClasses("outline-light", "lg", "border-white/70 hover:border-white hover:bg-white/10")}>
            Book Now
          </Link>
        </div>
      </Container>
    </section>
  );
}
