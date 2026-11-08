"use client";

import { useCallback, useState } from "react";
import { getRecaptchaToken, loadRecaptcha } from "@/lib/recaptcha";
import { submitForm, type FieldErrors } from "@/lib/submitForm";

export type FormStatus = "idle" | "submitting" | "success" | "error";

type Validatable = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** "photos[]" → "photos", matching the keys the PHP handlers return. */
const keyOf = (name: string) => name.replace(/\[\]$/, "");

/** Turns native constraint-validation failures into friendly inline messages. */
function nativeErrors(form: HTMLFormElement): FieldErrors {
  const errors: FieldErrors = {};
  for (const el of Array.from(form.elements) as Validatable[]) {
    if (!el.name || !el.willValidate || el.validity.valid) continue;
    const key = keyOf(el.name);
    if (errors[key]) continue;
    const v = el.validity;
    const type = (el as HTMLInputElement).type;
    let msg = el.validationMessage;
    if (v.valueMissing) {
      msg =
        type === "checkbox" ? "Please tick this box to continue."
        : type === "radio" || el instanceof HTMLSelectElement ? "Please choose an option."
        : "This field is required.";
    } else if (v.typeMismatch && type === "email") msg = "Please enter a valid email address.";
    else if (v.patternMismatch && el.title) msg = el.title;
    else if (v.tooShort) msg = `Please enter at least ${(el as HTMLInputElement).minLength} characters.`;
    else if (v.rangeUnderflow && type === "date") msg = "Please choose a date from today onwards.";
    errors[key] = msg;
  }
  return errors;
}

function focusFirst(form: HTMLFormElement, errors: FieldErrors) {
  const el = (Array.from(form.elements) as Validatable[]).find((e) => e.name && errors[keyOf(e.name)]);
  el?.focus({ preventScroll: false });
}

export function useFormSubmit({
  endpoint,
  action,
  validate,
}: {
  endpoint: string;
  /** reCAPTCHA action name — must match the PHP handler */
  action: "contact" | "booking";
  /** Extra client-side checks beyond native constraints */
  validate?: (form: HTMLFormElement) => FieldErrors;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status === "submitting") return;
      const form = e.currentTarget;

      const clientErrors = { ...nativeErrors(form), ...(validate?.(form) ?? {}) };
      if (Object.keys(clientErrors).length) {
        setErrors(clientErrors);
        setStatus("idle");
        setMessage("");
        focusFirst(form, clientErrors);
        return;
      }

      setErrors({});
      setMessage("");
      setStatus("submitting");

      const data = new FormData(form);
      try {
        const token = await getRecaptchaToken(action);
        if (token) data.set("recaptcha_token", token);
      } catch {
        // Let the server decide — it returns a clear message if a token was required.
      }

      const result = await submitForm(endpoint, data);
      setMessage(result.message);
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        if (result.errors && Object.keys(result.errors).length) {
          setErrors(result.errors);
          focusFirst(form, result.errors);
        }
      }
    },
    [action, endpoint, status, validate],
  );

  /** Clears a field's error as soon as the user edits it. */
  const onInput = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    if (!name) return;
    const key = keyOf(name);
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage("");
    setErrors({});
  }, []);

  return {
    status,
    message,
    errors,
    setErrors,
    reset,
    formProps: {
      noValidate: true,
      onSubmit,
      onInput,
      onFocus: () => void loadRecaptcha().catch(() => {}),
      "aria-busy": status === "submitting",
    },
  };
}
