import { pageMeta } from "@/lib/seo";
import { staticPageSeo } from "@/data/seo";
import { business } from "@/data/business";
import { acCoverageText, districtSummary } from "@/data/postcodes";
import { buildServices } from "@/lib/build-data";
import { PageHero } from "@/components/ui/PageHero";
import { BookingSection } from "@/components/booking/BookingSection";

export const metadata = pageMeta({ ...staticPageSeo.book, path: "/book/" });

export default async function BookPage() {
  const services = await buildServices();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Book Now" }]}
        eyebrow="Booking"
        title="Book online"
        intro="Choose what you need, tell us about the problem and pick a 2-hour slot. Your booking is confirmed straight away. Prefer to talk? Call us instead."
      />
      <BookingSection
        services={services}
        title="Your booking"
        intro="Domestic, commercial or air conditioning — choose the service from the list to get started."
        coverage={`Domestic: ${districtSummary()}. Air conditioning: ${acCoverageText}. Commercial: call ${business.phone.display} if you're unsure.`}
        tone="white"
      />
    </>
  );
}
