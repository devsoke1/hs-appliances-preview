"use client";

import { Send } from "lucide-react";
import { useFormSubmit } from "./useFormSubmit";
import {
  aria,
  ConsentCheckbox,
  Field,
  FormError,
  FormSuccess,
  Honeypot,
  Input,
  PHONE_PATTERN,
  RecaptchaNotice,
  SubmitButton,
  Textarea,
} from "./fields";

export function ContactForm() {
  const { status, message, errors, reset, formProps } = useFormSubmit({ endpoint: "/api/contact.php", action: "contact" });
  const submitting = status === "submitting";

  if (status === "success") {
    return <FormSuccess title="Message sent" message={message} resetLabel="Send another message" onReset={reset} />;
  }

  return (
    <form action="/api/contact.php" method="post" className="relative space-y-5" {...formProps}>
      <Honeypot />
      <fieldset disabled={submitting} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" htmlFor="c-name" required error={errors.name}>
            <Input id="c-name" name="name" autoComplete="name" required minLength={2} maxLength={100} {...aria(errors, "name", "c-name")} />
          </Field>
          <Field label="Phone" htmlFor="c-phone" required error={errors.phone}>
            <Input
              id="c-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              pattern={PHONE_PATTERN}
              title="Please enter a valid phone number."
              {...aria(errors, "phone", "c-phone")}
            />
          </Field>
        </div>
        <Field label="Email" htmlFor="c-email" required error={errors.email}>
          <Input id="c-email" name="email" type="email" autoComplete="email" required maxLength={150} {...aria(errors, "email", "c-email")} />
        </Field>
        <Field label="Postcode" htmlFor="c-postcode" error={errors.postcode}>
          <Input id="c-postcode" name="postcode" autoComplete="postal-code" maxLength={10} className="uppercase sm:max-w-48" {...aria(errors, "postcode", "c-postcode")} />
        </Field>
        <Field label="How can we help?" htmlFor="c-message" required error={errors.message}>
          <Textarea
            id="c-message"
            name="message"
            required
            minLength={10}
            maxLength={3000}
            placeholder="Appliance, make & model, and what it's doing…"
            {...aria(errors, "message", "c-message")}
          />
        </Field>
        <ConsentCheckbox id="c-consent" error={errors.consent} />
      </fieldset>

      {status === "error" && <FormError message={message} />}

      <SubmitButton submitting={submitting} icon={<Send className="size-5" aria-hidden />}>
        Send message
      </SubmitButton>
      <RecaptchaNotice />
    </form>
  );
}
