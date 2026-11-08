"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, ImagePlus, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { FieldErrors } from "@/lib/submitForm";
import { useFormSubmit } from "./useFormSubmit";
import {
  aria,
  ConsentCheckbox,
  Field,
  FieldError,
  FormError,
  FormSuccess,
  Honeypot,
  Input,
  PHONE_PATTERN,
  RecaptchaNotice,
  Select,
  SubmitButton,
  Textarea,
} from "./fields";

const ENDPOINT = "/api/booking.php";
const MAX_FILES = 3;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

type Option = { value: string; label: string };

function checkFiles(list: File[]): string | null {
  if (list.length > MAX_FILES) return `Please choose up to ${MAX_FILES} photos.`;
  const tooBig = list.find((f) => f.size > MAX_BYTES);
  if (tooBig) return `"${tooBig.name}" is over 5MB. Please choose a smaller photo.`;
  // Some phones report HEIC with an empty type — allow by extension, the server checks the real type.
  const bad = list.find((f) => (f.type ? !ACCEPT.includes(f.type) : !/\.(heic|heif)$/i.test(f.name)));
  if (bad) return `"${bad.name}" isn't a supported image. Please use JPG, PNG, WEBP or HEIC.`;
  return null;
}

export function BookingForm({ domestic, commercial, brands }: { domestic: Option[]; commercial: Option[]; brands: string[] }) {
  const validate = useCallback((form: HTMLFormElement): FieldErrors => {
    const input = form.elements.namedItem("photos[]") as HTMLInputElement | null;
    const err = checkFiles(Array.from(input?.files ?? []));
    return err ? { photos: err } : {};
  }, []);

  const { status, message, errors, setErrors, reset, formProps } = useFormSubmit({ endpoint: ENDPOINT, action: "booking", validate });
  const submitting = status === "submitting";

  const [postcode, setPostcode] = useState("");
  const [appliance, setAppliance] = useState("");
  const [minDate, setMinDate] = useState<string>();
  const [maxDate, setMaxDate] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);

  // Prefill from ?postcode= / ?service= (set by the postcode checker and service pages)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pc = q.get("postcode");
    const svc = q.get("service");
    if (pc) setPostcode(pc.toUpperCase().slice(0, 10));
    if (svc && [...domestic, ...commercial].some((o) => o.value === svc)) setAppliance(svc);
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const now = new Date();
    setMinDate(iso(now));
    setMaxDate(iso(new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())));
  }, [domestic, commercial]);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    const err = checkFiles(list);
    if (err) {
      e.target.value = "";
      setFiles([]);
      setErrors((prev) => ({ ...prev, photos: err }));
      return;
    }
    setFiles(list);
  };

  const clearFiles = () => {
    const input = document.getElementById("b-photos") as HTMLInputElement | null;
    if (input) input.value = "";
    setFiles([]);
  };

  if (status === "success") {
    return (
      <FormSuccess
        title="Booking request sent"
        message={message}
        resetLabel="Make another booking"
        onReset={() => {
          setFiles([]);
          reset();
        }}
      />
    );
  }

  return (
    <form action={ENDPOINT} method="post" encType="multipart/form-data" className="relative space-y-8" {...formProps}>
      <Honeypot />

      <fieldset disabled={submitting} className="space-y-5">
        <legend className="mb-4 font-display text-lg font-extrabold text-ink">1. Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="b-name" required error={errors.name}>
            <Input id="b-name" name="name" autoComplete="name" required minLength={2} maxLength={100} {...aria(errors, "name", "b-name")} />
          </Field>
          <Field label="Phone" htmlFor="b-phone" required error={errors.phone}>
            <Input
              id="b-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              pattern={PHONE_PATTERN}
              title="Please enter a valid phone number."
              {...aria(errors, "phone", "b-phone")}
            />
          </Field>
        </div>
        <Field label="Email" htmlFor="b-email" required error={errors.email}>
          <Input id="b-email" name="email" type="email" autoComplete="email" required maxLength={150} {...aria(errors, "email", "b-email")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Postcode" htmlFor="b-postcode" required error={errors.postcode}>
            <Input
              id="b-postcode"
              name="postcode"
              autoComplete="postal-code"
              required
              maxLength={10}
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              pattern="[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}"
              title="Please enter a full UK postcode, e.g. TW13 6AD."
              {...aria(errors, "postcode", "b-postcode")}
            />
          </Field>
          <Field label="Address" htmlFor="b-address" required error={errors.address} className="sm:col-span-2">
            <Input
              id="b-address"
              name="address"
              autoComplete="street-address"
              required
              minLength={5}
              maxLength={200}
              placeholder="House number and street, town"
              {...aria(errors, "address", "b-address")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset disabled={submitting} className="space-y-5">
        <legend className="mb-4 font-display text-lg font-extrabold text-ink">2. Your appliance</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Appliance type" htmlFor="b-appliance" required error={errors.appliance}>
            <Select
              id="b-appliance"
              name="appliance"
              required
              value={appliance}
              onChange={(e) => setAppliance(e.target.value)}
              {...aria(errors, "appliance", "b-appliance")}
            >
              <option value="" disabled>
                Choose an appliance…
              </option>
              <optgroup label="Domestic">
                {domestic.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Commercial">
                {commercial.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
              <option value="other">Other / not sure</option>
            </Select>
          </Field>
          <Field label="Brand" htmlFor="b-brand" required error={errors.brand}>
            <Select id="b-brand" name="brand" required defaultValue="" {...aria(errors, "brand", "b-brand")}>
              <option value="" disabled>
                Choose a brand…
              </option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="Other">Other</option>
              <option value="Not sure">Not sure</option>
            </Select>
          </Field>
        </div>
        <Field
          label="Describe the fault"
          htmlFor="b-fault"
          required
          error={errors.fault}
          hint="What's it doing (or not doing)? Include any error code and the model number if you have it."
        >
          <Textarea id="b-fault" name="fault" required minLength={10} maxLength={3000} {...aria(errors, "fault", "b-fault")} />
        </Field>
        <Field label="Photos" htmlFor="b-photos" error={errors.photos} hint="Up to 3 images, 5MB each — the rating plate or error code is especially helpful.">
          <label
            htmlFor="b-photos"
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed bg-mist px-4 py-4 text-body transition-colors hover:border-brand-500",
              errors.photos ? "border-red-600" : "border-line",
            )}
          >
            <ImagePlus className="size-6 shrink-0 text-brand-600" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[0.9375rem]">{files.length ? files.map((f) => f.name).join(", ") : "Tap to add photos"}</span>
          </label>
          <input
            id="b-photos"
            name="photos[]"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            multiple
            onChange={onFiles}
            className="sr-only"
            {...aria(errors, "photos", "b-photos")}
          />
          {files.length > 0 && (
            <button type="button" onClick={clearFiles} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
              <X className="size-4" aria-hidden /> Remove photos
            </button>
          )}
        </Field>
      </fieldset>

      <fieldset disabled={submitting} className="space-y-5">
        <legend className="mb-4 font-display text-lg font-extrabold text-ink">3. When suits you?</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Preferred date" htmlFor="b-date" required error={errors.preferred_date} hint="We'll confirm availability by phone.">
            <Input id="b-date" name="preferred_date" type="date" required min={minDate} max={maxDate} {...aria(errors, "preferred_date", "b-date")} />
          </Field>
          <div>
            <p id="slot-label" className="mb-1.5 font-display text-[0.9375rem] font-bold text-ink">
              Time slot
              <span className="ml-0.5 text-accent-600" aria-hidden>
                *
              </span>
            </p>
            <div role="radiogroup" aria-labelledby="slot-label" {...aria(errors, "time_slot", "b-slot")} className="grid grid-cols-2 gap-3">
              {[
                { value: "AM", label: "Morning", sub: "AM", Icon: Sun },
                { value: "PM", label: "Afternoon", sub: "PM", Icon: Moon },
              ].map(({ value, label, sub, Icon }) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" name="time_slot" value={value} required className="peer sr-only" />
                  <span
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-lg border bg-white font-display font-bold text-navy-900 transition-colors",
                      "peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500",
                      errors.time_slot ? "border-red-600" : "border-line",
                    )}
                  >
                    <Icon className="size-4" aria-hidden /> {label} <span className="text-xs opacity-70">{sub}</span>
                  </span>
                </label>
              ))}
            </div>
            <FieldError id="b-slot" message={errors.time_slot} />
          </div>
        </div>
      </fieldset>

      <div className="space-y-5 border-t border-line pt-6">
        <ConsentCheckbox id="b-consent" error={errors.consent} />
        {status === "error" && <FormError message={message} />}
        <SubmitButton submitting={submitting} busyLabel={files.length ? "Uploading…" : "Sending…"} icon={<CalendarCheck className="size-5" aria-hidden />}>
          Request booking
        </SubmitButton>
        <p className="text-base text-muted">This is a booking request — we&rsquo;ll call or email to confirm your appointment.</p>
        <RecaptchaNotice />
      </div>
    </form>
  );
}
