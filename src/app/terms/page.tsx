import { business, fullAddress, mailHref } from "@/data/business";
import { pageMeta } from "@/lib/seo";
import { staticPageSeo } from "@/data/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Prose, Todo } from "@/components/ui/Prose";

export const metadata = pageMeta({ ...staticPageSeo.terms, path: "/terms/" });

/** Template terms — every [ADD]/[CONFIRM] must be filled in, and the whole page reviewed, before launch. */
export default function TermsPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Terms & Conditions" }]} eyebrow="Legal" title="Terms & conditions" intro="The terms that apply when you book a repair, installation or maintenance visit with us." />
      <Container className="py-14 sm:py-16">
        <Prose>
          <p>
            <strong>Last updated:</strong> <Todo>[ADD DATE]</Todo>
          </p>

          <h2>1. About us</h2>
          <p>
            These terms apply to services provided by {business.name}, {fullAddress}. Contact:{" "}
            {business.phone.display}, <a href={mailHref}>{business.email}</a>.
          </p>

          <h2>2. Bookings</h2>
          <p>
            When you book online you choose a 2-hour arrival window, and the booking is confirmed on screen and by email. We aim to arrive
            within that window; if we&rsquo;re delayed or need to move your appointment, we&rsquo;ll contact you as soon as possible. To
            change or cancel a booking, call us and quote your booking reference. An adult must be present at the property for the visit.
          </p>

          <h2>3. Call-out charge and quotes</h2>
          <p>
            {business.callOutNote} The fee for your area is confirmed when you book. After diagnosing the fault, we give you a quote
            for the parts and the labour. No repair work goes ahead without your agreement.
          </p>

          <h2>4. Parts</h2>
          <p>
            If a part isn&rsquo;t available on the day, we may need to order it and arrange a return visit.{" "}
            <Todo>[CONFIRM: whether a deposit is needed for ordered parts, and whether you use genuine or compatible parts.]</Todo>
          </p>

          <h2>5. Payment</h2>
          <p>
            Payment is due <Todo>[ADD: e.g. on completion of the work]</Todo>. We accept <Todo>[ADD payment methods]</Todo>. Business
            customers may be invoiced by agreement <Todo>[CONFIRM payment terms]</Todo>.
          </p>

          <h2>6. Cancellations</h2>
          <p>
            Please give us as much notice as possible if you need to cancel or rearrange.{" "}
            <Todo>[ADD: cancellation notice period and any charges for late cancellation or failed access.]</Todo>
          </p>

          <h2>7. Guarantee</h2>
          <p>
            <Todo>[ADD: guarantee period on parts and labour, what it covers and what it excludes — or remove this section.]</Todo>
          </p>

          <h2>8. Safety</h2>
          <p>
            We may decline to work on, or may make safe, any appliance or installation we consider unsafe, and we&rsquo;ll explain why. Where
            an appliance is found to be dangerous, we may advise that it&rsquo;s disconnected and not used until it has been repaired.
          </p>

          <h2>9. Your rights</h2>
          <p>
            If you&rsquo;re a consumer, you have legal rights under the Consumer Rights Act 2015, including the right for services to be
            carried out with reasonable care and skill. Nothing in these terms affects those rights.
          </p>

          <h2>10. Liability</h2>
          <p>
            We are not responsible for faults that are unrelated to the work we carried out, or for pre-existing damage. Nothing in these terms
            limits our liability for death or personal injury caused by our negligence, or for anything else that cannot be limited by law.
          </p>

          <h2>11. Governing law</h2>
          <p>These terms are governed by the law of England and Wales.</p>
        </Prose>
      </Container>
    </>
  );
}
