"use client";

import Link from "@/components/ui/SiteLink";
import { ArrowRight } from "lucide-react";
import { useLiveServices } from "@/lib/live";
import { homepagePick, type ServicesPayload } from "@/lib/live-types";
import { isAcService } from "@/lib/booking";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceCardGrid } from "@/components/ServiceCard";
import { ServiceTabs } from "@/components/ServiceTabs";

/**
 * Homepage services: Domestic / Commercial tabs, each limited to `homepage_services_limit` (settings),
 * featured first then sort order. Build-time fallback is rendered immediately; live data replaces it.
 */
export function ServicesShowcase({ initial }: { initial: ServicesPayload }) {
  const { services: all, homepageLimit } = useLiveServices(initial);
  const services = all.filter((s) => !isAcService(s.slug)); // air conditioning has its own page
  return (
    <>
      <ServiceTabs
        domestic={<ServiceCardGrid services={homepagePick(services, "domestic", homepageLimit)} />}
        commercial={<ServiceCardGrid services={homepagePick(services, "commercial", homepageLimit)} />}
      />
      <div className="mt-8 flex justify-center sm:mt-10">
        <Link href="/services/" className={buttonClasses("secondary", "lg", "w-full sm:w-auto")}>
          View All Services <ArrowRight className="size-5" aria-hidden />
        </Link>
      </div>
    </>
  );
}
