"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, ImagePlus, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { ConsentCheckbox, Field, Honeypot, Input, NotConnectedNotice, PHONE_PATTERN, Select, Textarea } from "./fields";

const ENDPOINT = "/api/booking.php";
const MAX_FILES = 3;
const MAX_BYTES = 5 * 1024 * 1024;

type Option = { value: string; label: string };

export function BookingForm({
  domestic,
  commercial,
  brands,
}: {
  domestic: Option[];
  commercial: Option[];
  brands: string[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [appliance, setAppliance] = useState("");
  const [minDate, setMinDate] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");

  // Prefill from ?postcode= / ?service= (set by the postcode checker and service pages)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const pc = q.get("postcode");
    const svc = q.get("service");
    if (pc) setPostcode(pc.toUpperCase().slice(0, 10));
    if (svc && [...domestic, ...commercial].some((o) => o.value === svc)) setAppliance(svc);
    const d = new Date();
    setMinDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, [domestic, commercial]);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    setFileError("");
    if (list.length > MAX_FILES) {
      setFileError(`Please choose up to ${MAX_FILES} photos.`);
      e.target.value = "";
      setFiles([]);
      return;
    }
    const tooBig = list.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setFileError(`"${tooBig.name}" is over 5MB. Please choose a smaller photo.`);
      e.target.value = "";
      setFiles([]);
      return;
    }
    setFiles(list);
  };

  return (
    <form
      action={ENDPOINT}
      method="post"
      encType="multipart/form-data"
      className="relative space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (!fileError && e.currentTarget.reportValidity()) setSubmitted(true);
      }}
    >
      <Honeypot />

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-lg font-extrabold text-ink">1. Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="b-name" required>
            <Input id="b-name" name="name" autoComplete="name" required maxLength={100} />
          </Field>
          <Field label="Phone" htmlFor="b-phone" required>
            <Input id="b-phone" name="phone" type="tel" autoComplete="tel" required pattern={PHONE_PATTERN} title="Please enter a valid phone number" />
          </Field>
        </div>
        <Field label="Email" htmlFor="b-email" required>
          <Input id="b-email" name="email" type="email" autoComplete="email" required maxLength={150} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Postcode" htmlFor="b-postcode" required>
            <Input
              id="b-postcode"
              name="postcode"
              autoComplete="postal-code"
              required
              maxLength={10}
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              pattern="[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}"
              title="Please enter a full UK postcode, e.g. TW13 6AD"
            />
          </Field>
          <Field label="Address" htmlFor="b-address" required className="sm:col-span-2">
            <Input id="b-address" name="address" autoComplete="street-address" required maxLength={200} placeholder="House number and street, town" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-lg font-extrabold text-ink">2. Your appliance</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Appliance type" htmlFor="b-appliance" required>
            <Select id="b-appliance" name="appliance" required value={appliance} onChange={(e) => setAppliance(e.target.value)}>
              <option value="" disabled>
                Choose an appliance…
              </option>
              <optgroup label="Domestic">
                {domestic.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </optgroup>
              <optgroup label="Commercial">
                {commercial.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </optgroup>
              <option value="other">Other / not sure</option>
            </Select>
          </Field>
          <Field label="Brand" htmlFor="b-brand" required>
            <Select id="b-brand" name="brand" required defaultValue="">
              <option value="" disabled>
                Choose a brand…
              </option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
              <option value="Other">Other</option>
              <option value="Not sure">Not sure</option>
            </Select>
          </Field>
        </div>
        <Field label="Describe the fault" htmlFor="b-fault" required hint="What's it doing (or not doing)? Include any error code and the model number if you have it.">
          <Textarea id="b-fault" name="fault" required minLength={10} maxLength={3000} />
        </Field>
        <Field label="Photos" htmlFor="b-photos" hint="Up to 3 images, 5MB each — the rating plate or error code is especially helpful.">
          <label
            htmlFor="b-photos"
            className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-line bg-mist px-4 py-4 text-body transition-colors hover:border-brand-500"
          >
            <ImagePlus className="size-6 shrink-0 text-brand-600" aria-hidden />
            <span className="text-[0.9375rem]">
              {files.length ? files.map((f) => f.name).join(", ") : "Tap to add photos"}
            </span>
          </label>
          <input id="b-photos" name="photos[]" type="file" accept="image/jpeg,image/png,image/webp,image/heic" multiple onChange={onFiles} className="sr-only" />
          {fileError && <p role="alert" className="mt-1.5 text-sm font-semibold text-accent-700">{fileError}</p>}
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-lg font-extrabold text-ink">3. When suits you?</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Preferred date" htmlFor="b-date" required hint="We'll confirm availability by phone.">
            <Input id="b-date" name="preferred_date" type="date" required min={minDate} />
          </Field>
          <div>
            <p id="slot-label" className="mb-1.5 font-display text-[0.9375rem] font-bold text-ink">
              Time slot<span className="ml-0.5 text-accent-600" aria-hidden>*</span>
            </p>
            <div role="radiogroup" aria-labelledby="slot-label" className="grid grid-cols-2 gap-3">
              {[
                { value: "AM", label: "Morning", sub: "AM", Icon: Sun },
                { value: "PM", label: "Afternoon", sub: "PM", Icon: Moon },
              ].map(({ value, label, sub, Icon }) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" name="time_slot" value={value} required className="peer sr-only" />
                  <span
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-lg border border-line bg-white font-display font-bold text-navy-900 transition-colors",
                      "peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500",
                    )}
                  >
                    <Icon className="size-4" aria-hidden /> {label} <span className="text-xs opacity-70">{sub}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <div className="space-y-5 border-t border-line pt-6">
        <ConsentCheckbox />
        <button type="submit" className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
          <CalendarCheck className="size-5" aria-hidden /> Request booking
        </button>
        <p className="text-sm text-muted">This is a booking request — we&rsquo;ll call or email to confirm your appointment.</p>
        {submitted && <NotConnectedNotice endpoint={ENDPOINT} />}
      </div>
    </form>
  );
}
