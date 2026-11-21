"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { recaptchaEnabled } from "@/lib/recaptcha";
import type { FieldErrors } from "@/lib/submitForm";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";

export const inputClass =
  "block w-full rounded-lg border border-line bg-white px-4 text-ink placeholder:text-muted/80 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 aria-invalid:border-red-600 aria-invalid:ring-2 aria-invalid:ring-red-600/15 disabled:opacity-60";

/** Phone pattern — parentheses/hyphen escaped so it's valid under the HTML `v`-flag regex mode. */
export const PHONE_PATTERN = "[0-9 +\\(\\)\\-]{10,20}";

/** aria-invalid / aria-describedby for a control, given the form's error map. */
export function aria(errors: FieldErrors, name: string, id: string) {
  return errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-red-700">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block font-display text-[0.9375rem] font-bold text-ink">
        {label}
        {required ? (
          <span className="ml-0.5 text-accent-600" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1.5 text-sm font-semibold text-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-base text-muted">{hint}</p>}
      <FieldError id={htmlFor} message={error} />
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, "min-h-32 py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(inputClass, "h-12 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  );
}

/** Hidden spam trap — real users never see or fill it. The PHP handler silently drops submissions where it's filled. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="company_website">Leave this field empty</label>
      <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function ConsentCheckbox({ id, error }: { id: string; error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-[0.9375rem] text-body">
        <input
          id={id}
          type="checkbox"
          name="consent"
          value="yes"
          required
          className="mt-1 size-5 shrink-0 rounded border-line accent-brand-600"
          {...(error ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {})}
        />
        <span>
          I agree to {business.name} using these details to respond to my enquiry, as described in the{" "}
          <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/privacy-policy/`} className="font-semibold text-brand-600 underline underline-offset-2">
            privacy policy
          </a>
          .
          <span className="text-accent-600" aria-hidden>
            {" "}
            *
          </span>
        </span>
      </label>
      <FieldError id={id} message={error} />
    </div>
  );
}

export function SubmitButton({ submitting, icon, children, busyLabel = "Sending…" }: { submitting: boolean; icon: React.ReactNode; children: React.ReactNode; busyLabel?: string }) {
  return (
    <button type="submit" disabled={submitting} className={buttonClasses("primary", "lg", "w-full sm:w-auto disabled:opacity-80")}>
      {submitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : icon}
      {submitting ? busyLabel : children}
    </button>
  );
}

/** Server/network error banner, with a call fallback. */
export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-[0.9375rem] text-red-800">
      <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">{message}</p>
        <a href={telHref} className="mt-2 inline-flex items-center gap-1.5 font-bold text-red-900 underline underline-offset-2">
          <Phone className="size-4" aria-hidden /> Call {business.phone.display}
        </a>
      </div>
    </div>
  );
}

/** Replaces the form after a successful submission. Receives focus so screen readers announce it. */
export function FormSuccess({ title, message, resetLabel, onReset }: { title: string; message: string; resetLabel: string; onReset: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="rounded-[var(--radius-card)] border border-emerald-200 bg-emerald-50 p-6 outline-none sm:p-8">
      <CheckCircle2 className="size-10 text-emerald-600" aria-hidden />
      <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">{title}</h2>
      <p className="mt-2 text-lead text-body">{message}</p>
      <p className="mt-4 text-[0.9375rem] text-muted">
        Need us urgently? Call{" "}
        <a href={telHref} className="font-bold text-brand-600">
          {business.phone.display}
        </a>
        .
      </p>
      <button type="button" onClick={onReset} className={buttonClasses("outline", "md", "mt-6")}>
        {resetLabel}
      </button>
    </div>
  );
}

/** Required by Google when reCAPTCHA is active. Renders nothing otherwise. */
export function RecaptchaNotice() {
  if (!recaptchaEnabled) return null;
  return (
    <p className="text-xs text-muted">
      This site is protected by reCAPTCHA and the Google{" "}
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
        Privacy Policy
      </a>{" "}
      and{" "}
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
