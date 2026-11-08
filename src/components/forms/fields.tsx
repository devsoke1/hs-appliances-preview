import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export const inputClass =
  "block w-full rounded-lg border border-line bg-white px-4 text-ink placeholder:text-muted/80 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 user-invalid:border-accent-600 user-invalid:ring-accent-600/20";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block font-display text-[0.9375rem] font-bold text-ink">
        {label}
        {required ? <span className="ml-0.5 text-accent-600" aria-hidden>*</span> : <span className="ml-1.5 text-sm font-semibold text-muted">(optional)</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
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

/** Phone pattern — parentheses/hyphen escaped so it's valid under the HTML `v`-flag regex mode. */
export const PHONE_PATTERN = "[0-9 +\\(\\)\\-]{10,20}";

/** Hidden spam trap — real users never see or fill it. The PHP handler rejects submissions where it's filled. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="company_website">Leave this field empty</label>
      <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function ConsentCheckbox() {
  return (
    <label className="flex items-start gap-3 text-[0.9375rem] text-body">
      <input type="checkbox" name="consent" value="yes" required className="mt-1 size-5 shrink-0 rounded border-line accent-brand-600" />
      <span>
        I agree to House &amp; Shop Appliances using these details to respond to my enquiry, as described in the{" "}
        <a href="/privacy-policy/" className="font-semibold text-brand-600 underline underline-offset-2">privacy policy</a>.
        <span className="text-accent-600" aria-hidden> *</span>
      </span>
    </label>
  );
}

/** Shown after submit while forms are UI-only (Phase 3 wires them to PHP). */
export function NotConnectedNotice({ endpoint }: { endpoint: string }) {
  return (
    <div role="status" className="rounded-lg border-2 border-dashed border-accent-400/70 bg-accent-50 p-4 text-sm text-accent-700">
      <p className="font-mono font-semibold uppercase tracking-wide">[PHASE 3] Form not connected yet</p>
      <p className="mt-1">Validation passed. This form will POST to <code className="font-mono">{endpoint}</code> once the PHP handler is added.</p>
    </div>
  );
}
