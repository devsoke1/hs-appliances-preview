"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { ConsentCheckbox, Field, Honeypot, Input, NotConnectedNotice, PHONE_PATTERN, Textarea } from "./fields";

const ENDPOINT = "/api/contact.php";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      action={ENDPOINT}
      method="post"
      className="relative space-y-5"
      onSubmit={(e) => {
        // UI-only for now: validate in the browser, don't send.
        e.preventDefault();
        if (e.currentTarget.reportValidity()) setSubmitted(true);
      }}
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="c-name" required>
          <Input id="c-name" name="name" autoComplete="name" required maxLength={100} />
        </Field>
        <Field label="Phone" htmlFor="c-phone" required>
          <Input id="c-phone" name="phone" type="tel" autoComplete="tel" required pattern={PHONE_PATTERN} title="Please enter a valid phone number" />
        </Field>
      </div>
      <Field label="Email" htmlFor="c-email" required>
        <Input id="c-email" name="email" type="email" autoComplete="email" required maxLength={150} />
      </Field>
      <Field label="Postcode" htmlFor="c-postcode">
        <Input id="c-postcode" name="postcode" autoComplete="postal-code" maxLength={10} className="uppercase sm:max-w-48" />
      </Field>
      <Field label="How can we help?" htmlFor="c-message" required>
        <Textarea id="c-message" name="message" required maxLength={3000} placeholder="Appliance, make & model, and what it's doing…" />
      </Field>
      <ConsentCheckbox />
      <button type="submit" className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
        <Send className="size-5" aria-hidden /> Send message
      </button>
      {submitted && <NotConnectedNotice endpoint={ENDPOINT} />}
    </form>
  );
}
