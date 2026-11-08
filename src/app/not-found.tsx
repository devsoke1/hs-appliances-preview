import { Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <Section className="text-center">
      <div className="mx-auto max-w-xl py-10">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="text-display">Page not found</h1>
        <p className="text-lead mt-4 text-muted">
          The page you&rsquo;re looking for has moved or doesn&rsquo;t exist. Try our services, or give us a call.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/services/" variant="secondary">View services</Button>
          <Button href={telHref}><Phone className="size-4" aria-hidden /> {business.phone.display}</Button>
        </div>
      </div>
    </Section>
  );
}
