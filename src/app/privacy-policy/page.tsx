import { business, fullAddress, mailHref } from "@/data/business";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Prose, Todo } from "@/components/ui/Prose";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description: `How ${business.name} collects, uses and protects your personal information.`,
  path: "/privacy-policy/",
});

/**
 * Template privacy policy written for UK GDPR. Have it reviewed before launch,
 * and update it in Phase 3 once the form handler / email provider is chosen.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Privacy Policy" }]} eyebrow="Legal" title="Privacy policy" intro="How we collect, use and protect your personal information." />
      <Container className="py-14 sm:py-16">
        <Prose>
          <p>
            <strong>Last updated:</strong> <Todo>[ADD DATE]</Todo>
          </p>

          <h2>Who we are</h2>
          <p>
            This website is operated by {business.name} (<Todo>{business.legalName}</Todo>), {fullAddress}. We are the data controller for
            personal information collected through this website. Contact us about privacy at <a href={mailHref}>{business.email}</a>.
          </p>

          <h2>What information we collect</h2>
          <p>When you contact us or request a booking, we collect the information you give us, which may include:</p>
          <ul>
            <li>your name, phone number and email address;</li>
            <li>your address and postcode, so we can visit and check we cover your area;</li>
            <li>details about your appliance and the fault, including any photos you upload;</li>
            <li>your preferred appointment date and time slot;</li>
            <li>records of our calls, emails and messages with you.</li>
          </ul>
          <p>
            Our hosting provider may also record basic technical information (such as IP address and browser type) in server logs for
            security and to keep the site running.
          </p>

          <h2>How we use your information</h2>
          <ul>
            <li>to respond to your enquiry and arrange, carry out and follow up repairs;</li>
            <li>to send quotes and invoices and take payment;</li>
            <li>to keep records needed for accounting, legal and warranty purposes;</li>
            <li>to keep our website secure and prevent spam or misuse.</li>
          </ul>
          <p>We do not sell your information, and we don&rsquo;t send marketing emails unless you&rsquo;ve asked us to.</p>

          <h2>Our lawful basis</h2>
          <p>
            We process your information because it&rsquo;s needed to take steps at your request before entering into a contract, or to
            perform a contract with you (contract); to meet legal obligations such as keeping financial records (legal obligation); and for
            our legitimate interests in running and securing our business (legitimate interests).
          </p>

          <h2>Who we share it with</h2>
          <p>We only share your information where necessary, with:</p>
          <ul>
            <li>our website hosting provider and email provider, who store data on our behalf;</li>
            <li>parts suppliers or manufacturers, only where needed to order parts for your repair;</li>
            <li>our accountant, and authorities where the law requires it.</li>
          </ul>
          <p>
            <Todo>[CONFIRM: list your actual providers, e.g. Hostinger (hosting), Gmail / Google Workspace (email).]</Todo>
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep enquiries that don&rsquo;t lead to a booking for <Todo>[ADD, e.g. 12 months]</Todo>. Job and invoice records are kept for
            as long as required for tax and accounting purposes (usually six years).
          </p>

          <h2>Cookies and third-party content</h2>
          <p>
            This website does not use advertising or analytics cookies. Our fonts are served from our own website. Our contact page includes
            an embedded Google Map. When it loads, Google may set cookies and collect data under the{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google Privacy Policy
            </a>
            . <Todo>[UPDATE if you add analytics or other tracking — you'll then need a cookie consent banner.]</Todo>
          </p>

          <h2>Your rights</h2>
          <p>
            Under UK data protection law you have the right to access the personal information we hold about you, to have it corrected or
            deleted, to restrict or object to its use, and to data portability. To exercise any of these rights, email{" "}
            <a href={mailHref}>{business.email}</a>.
          </p>
          <p>
            If you&rsquo;re unhappy with how we&rsquo;ve handled your information, you can complain to the Information Commissioner&rsquo;s
            Office (ICO) at{" "}
            <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
              ico.org.uk
            </a>
            .
          </p>

          <h2>Security</h2>
          <p>
            This website uses HTTPS encryption. We take reasonable steps to protect your information, and we limit access to the people who
            need it to provide our service.
          </p>

          <h2>Changes to this policy</h2>
          <p>We may update this policy from time to time. The latest version will always be on this page.</p>
        </Prose>
      </Container>
    </>
  );
}
