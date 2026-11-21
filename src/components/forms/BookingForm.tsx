"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2, MapPinOff, Phone, RefreshCw } from "lucide-react";
import { business, telHref } from "@/data/business";
import { isCovered, outwardCode } from "@/data/postcodes";
import {
  bookingGroups,
  categoryOfRef,
  refForParam,
  SELECT_REF_EVENT,
  slotLabel,
  TIME_SLOTS,
  type BookingCategory,
} from "@/lib/booking";
import { useLiveServices } from "@/lib/live";
import type { ServicesPayload } from "@/lib/live-types";
import type { FieldErrors, SubmitResult } from "@/lib/submitForm";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { useFormSubmit } from "./useFormSubmit";
import {
  aria,
  ConsentCheckbox,
  Field,
  FieldError,
  FormError,
  Honeypot,
  Input,
  PHONE_PATTERN,
  RecaptchaNotice,
  Select,
  SubmitButton,
  Textarea,
} from "./fields";

const ENDPOINT = "/api/booking.php";
const AVAILABILITY = "/api/availability.php";
const DAYS_PER_PAGE = 14;
const POSTCODE_RE = /^[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}$/;

type Day = { date: string; open: boolean; closed?: boolean; slots: Record<string, boolean> };
type Availability = { firstDate: string; lastDate: string; days: Day[] };
type Confirmed = { reference: string; booking_ref: string; date_label: string; slot_label: string };

const addDays = (ymd: string, n: number) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const dayParts = (ymd: string) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
    long: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }),
  };
};

function coverageMessage(category: BookingCategory | null, outward: string) {
  if (category === "domestic") return `Sorry, we can't take online domestic bookings for ${outward}. Please call us directly on ${business.phone.display}.`;
  if (category === "ac") return `Sorry, ${outward} is outside our air conditioning area (London, Berkshire and Reading). Please call us on ${business.phone.display}.`;
  return null;
}

/**
 * Online booking: booking reference (auto-filled from the service the customer chose), contact and
 * address details, a description of the problem and a live 2-hour slot picker. Posts to /api/booking.php.
 */
export function BookingForm({
  services: initialServices,
  categories = ["domestic", "commercial", "ac"],
  defaultRef = "",
  idPrefix = "b",
}: {
  services: ServicesPayload;
  /** Which booking groups to offer (e.g. only "ac" on the Air Conditioning page). */
  categories?: BookingCategory[];
  defaultRef?: string;
  idPrefix?: string;
}) {
  const { services } = useLiveServices(initialServices);
  const groups = useMemo(() => bookingGroups(services).filter((g) => categories.includes(g.category)), [services, categories]);
  const allRefs = useMemo(() => new Set(groups.flatMap((g) => g.options.map((o) => o.ref))), [groups]);

  const [ref, setRef] = useState(defaultRef);
  const [refFlash, setRefFlash] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = (name: string) => `${idPrefix}-${name}`;

  const category = categoryOfRef(ref);
  const outward = POSTCODE_RE.test(postcode.trim()) ? outwardCode(postcode) : null;
  const notCovered = outward && category && !isCovered(outward, category) ? coverageMessage(category, outward) : null;

  /* ── Booking reference: ?ref= / ?service= on load, and clicks on the page's service cards ── */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const param = q.get("ref") ?? q.get("service");
    const pc = q.get("postcode");
    if (pc) setPostcode(pc.toUpperCase().slice(0, 10));
    if (param) {
      const r = refForParam(groups, param);
      if (r) setRef(r);
    }
    // groups only changes when live services arrive; the URL is read once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onSelect = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      const r = allRefs.has(detail) ? detail : refForParam(groups, detail);
      if (!r || !allRefs.has(r)) return;
      setRef(r);
      setConfirmed(null);
      setRefFlash(true);
      window.setTimeout(() => setRefFlash(false), 1600);
    };
    window.addEventListener(SELECT_REF_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_REF_EVENT, onSelect);
  }, [allRefs, groups]);

  /* ── Availability ── */
  const load = useCallback(async (from?: string, append = false) => {
    if (!append) setLoadState("loading");
    try {
      const url = `${AVAILABILITY}?days=${DAYS_PER_PAGE}${from ? `&from=${from}` : ""}`;
      const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const j = (await res.json()) as { first_date: string; last_date: string; days: Day[] };
      setAvailability((prev) => ({
        firstDate: j.first_date,
        lastDate: j.last_date,
        days: append && prev ? [...prev.days, ...j.days.filter((d) => !prev.days.some((p) => p.date === d.date))] : j.days,
      }));
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** Re-fetch everything loaded so far (after a slot was taken by someone else). */
  const refresh = useCallback(async () => {
    if (!availability) return load();
    const count = availability.days.length;
    try {
      const res = await fetch(`${AVAILABILITY}?days=${Math.min(31, count)}&from=${availability.days[0]?.date ?? ""}`, { cache: "no-store" });
      const j = (await res.json()) as { first_date: string; last_date: string; days: Day[] };
      setAvailability((prev) => (prev ? { ...prev, days: prev.days.map((d) => j.days.find((n) => n.date === d.date) ?? d) } : prev));
    } catch {
      /* keep what we have */
    }
  }, [availability, load]);

  const selectedDay = availability?.days.find((d) => d.date === date);
  const lastLoaded = availability?.days[availability.days.length - 1]?.date;
  const canLoadMore = availability && lastLoaded && lastLoaded < availability.lastDate;

  // Default to the first day with a free slot
  useEffect(() => {
    if (!date && availability) {
      const first = availability.days.find((d) => d.open);
      if (first) setDate(first.date);
    }
  }, [availability, date]);

  /* ── Submit ── */
  const validate = useCallback(
    (form: HTMLFormElement): FieldErrors => {
      const errs: FieldErrors = {};
      const pc = (form.elements.namedItem("postcode") as HTMLInputElement | null)?.value ?? "";
      const out = POSTCODE_RE.test(pc.trim()) ? outwardCode(pc) : null;
      const cat = categoryOfRef((form.elements.namedItem("booking_ref") as HTMLSelectElement | null)?.value ?? "");
      if (out && cat && !isCovered(out, cat)) errs.postcode = coverageMessage(cat, out) ?? "";
      if (!date || !slot) errs.slot_start = "Please choose a date and a time slot.";
      return errs;
    },
    [date, slot],
  );

  const onResult = useCallback(
    (r: SubmitResult) => {
      if (r.success && r.data?.booking) setConfirmed(r.data.booking as Confirmed);
      if (r.data?.slot_taken) {
        setSlot("");
        void refresh();
      }
    },
    [refresh],
  );

  const { status, message, errors, reset, formProps } = useFormSubmit({ endpoint: ENDPOINT, action: "booking", validate, onResult });
  const submitting = status === "submitting";

  // Bring the confirmation into view (the form it replaces is much taller)
  useEffect(() => {
    if (status !== "success" || !confirmed || !rootRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rootRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    rootRef.current.focus({ preventScroll: true });
  }, [status, confirmed]);

  if (status === "success" && confirmed) {
    return (
      <div ref={rootRef} role="status" tabIndex={-1} className="scroll-mt-24 rounded-[var(--radius-card)] border border-emerald-200 bg-emerald-50 p-6 outline-none sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-7 shrink-0 text-emerald-700" aria-hidden />
          <div className="min-w-0">
            <p className="font-display text-2xl font-extrabold text-ink">Booking confirmed</p>
            <p className="mt-2 text-body">{message}</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 rounded-xl bg-white p-5 sm:grid-cols-2">
          {[
            ["Booking reference", confirmed.reference],
            ["Booking for", confirmed.booking_ref],
            ["Date", confirmed.date_label],
            ["Arrival window", confirmed.slot_label],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm font-semibold text-muted">{k}</dt>
              <dd className="font-display text-lg font-bold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-base text-muted">
          Need to change something? Call{" "}
          <a href={telHref} className="font-semibold text-brand-600 underline">
            {business.phone.display}
          </a>{" "}
          and quote your reference.
        </p>
        <button
          type="button"
          onClick={() => {
            setConfirmed(null);
            setSlot("");
            setDate("");
            reset();
            void load();
          }}
          className={buttonClasses("outline", "md", "mt-6")}
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <p className="mb-6 text-sm leading-relaxed text-muted">{business.callOutNote}</p>
      <form action={ENDPOINT} method="post" className="relative space-y-8" {...formProps}>
        <Honeypot />

        {/* 1. Booking reference */}
        <fieldset disabled={submitting} className="space-y-5">
          <legend className="mb-4 font-display text-lg font-extrabold text-ink">1. What are you booking?</legend>
          <Field
            label="Booking reference"
            htmlFor={id("ref")}
            required
            error={errors.booking_ref}
            hint="Filled in automatically from the service you chose — change it here if you need to."
          >
            <Select
              id={id("ref")}
              name="booking_ref"
              required
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              className={cn(refFlash && "border-accent-500 ring-4 ring-accent-500/25", ref && "font-semibold")}
              {...aria(errors, "booking_ref", id("ref"))}
            >
              <option value="" disabled>
                Choose a service…
              </option>
              {groups.map((g) => (
                <optgroup key={g.category} label={g.label}>
                  {g.options.map((o) => (
                    <option key={o.ref} value={o.ref}>
                      {o.ref}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </Field>
        </fieldset>

        {/* 2. Contact details */}
        <fieldset disabled={submitting} className="space-y-5">
          <legend className="mb-4 font-display text-lg font-extrabold text-ink">2. Your details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" htmlFor={id("first")} required error={errors.first_name}>
              <Input id={id("first")} name="first_name" autoComplete="given-name" required maxLength={60} {...aria(errors, "first_name", id("first"))} />
            </Field>
            <Field label="Last name" htmlFor={id("last")} required error={errors.last_name}>
              <Input id={id("last")} name="last_name" autoComplete="family-name" required maxLength={60} {...aria(errors, "last_name", id("last"))} />
            </Field>
            <Field label="Email" htmlFor={id("email")} required error={errors.email}>
              <Input id={id("email")} name="email" type="email" autoComplete="email" required maxLength={150} {...aria(errors, "email", id("email"))} />
            </Field>
            <Field label="Phone number" htmlFor={id("phone")} required error={errors.phone}>
              <Input
                id={id("phone")}
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                pattern={PHONE_PATTERN}
                title="Please enter a valid phone number."
                {...aria(errors, "phone", id("phone"))}
              />
            </Field>
          </div>
        </fieldset>

        {/* 3. Address */}
        <fieldset disabled={submitting} className="space-y-5">
          <legend className="mb-4 font-display text-lg font-extrabold text-ink">3. Address</legend>
          <Field label="Address line 1" htmlFor={id("addr1")} required error={errors.address_line1}>
            <Input id={id("addr1")} name="address_line1" autoComplete="address-line1" required minLength={3} maxLength={150} {...aria(errors, "address_line1", id("addr1"))} />
          </Field>
          <Field label="Address line 2" htmlFor={id("addr2")} error={errors.address_line2}>
            <Input id={id("addr2")} name="address_line2" autoComplete="address-line2" maxLength={150} {...aria(errors, "address_line2", id("addr2"))} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Town" htmlFor={id("town")} required error={errors.town}>
              <Input id={id("town")} name="town" autoComplete="address-level2" required minLength={2} maxLength={80} {...aria(errors, "town", id("town"))} />
            </Field>
            <Field label="City" htmlFor={id("city")} error={errors.city}>
              <Input id={id("city")} name="city" maxLength={80} {...aria(errors, "city", id("city"))} />
            </Field>
            <Field label="Postcode" htmlFor={id("postcode")} required error={errors.postcode}>
              <Input
                id={id("postcode")}
                name="postcode"
                autoComplete="postal-code"
                required
                maxLength={10}
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                pattern="[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}"
                title="Please enter a full UK postcode, e.g. TW13 6AD."
                {...aria(errors, "postcode", id("postcode"))}
              />
            </Field>
          </div>
          {notCovered && !errors.postcode && (
            <div role="alert" className="flex flex-col gap-3 rounded-xl border border-accent-100 bg-accent-50 p-4 sm:flex-row sm:items-center">
              <MapPinOff className="size-6 shrink-0 text-accent-700" aria-hidden />
              <p className="flex-1 text-base font-semibold text-ink">{notCovered}</p>
              <a href={telHref} className={buttonClasses("primary", "sm", "shrink-0")}>
                <Phone className="size-4" aria-hidden /> Call {business.phone.display}
              </a>
            </div>
          )}
        </fieldset>

        {/* 4. Problem */}
        <fieldset disabled={submitting} className="space-y-5">
          <legend className="mb-4 font-display text-lg font-extrabold text-ink">4. The problem</legend>
          <Field
            label="Note"
            htmlFor={id("note")}
            required
            error={errors.note}
            hint="Describe the problem — what it's doing (or not doing), any error code, and the make and model if you have it."
          >
            <Textarea id={id("note")} name="note" required minLength={10} maxLength={3000} {...aria(errors, "note", id("note"))} />
          </Field>
        </fieldset>

        {/* 5. Date and time slot */}
        <fieldset disabled={submitting} className="min-w-0 space-y-4">
          <legend className="mb-4 font-display text-lg font-extrabold text-ink">5. Choose a time</legend>
          <input type="hidden" name="slot_date" value={date} />

          {loadState === "loading" && !availability && (
            <div className="flex items-center gap-2 rounded-xl bg-mist p-4 text-base text-muted" role="status">
              <Loader2 className="size-5 animate-spin" aria-hidden /> Loading available times…
            </div>
          )}
          {loadState === "error" && !availability && (
            <div role="alert" className="rounded-xl border border-line bg-mist p-4 text-base">
              <p className="font-semibold text-ink">We couldn&rsquo;t load the available times.</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={() => void load()} className={buttonClasses("outline", "sm")}>
                  <RefreshCw className="size-4" aria-hidden /> Try again
                </button>
                <a href={telHref} className={buttonClasses("primary", "sm")}>
                  <Phone className="size-4" aria-hidden /> Call {business.phone.display}
                </a>
              </div>
            </div>
          )}

          {availability && (
            <>
              <div>
                <p id={id("date-label")} className="mb-2 font-display text-[0.9375rem] font-bold text-ink">
                  Date<span className="ml-0.5 text-accent-600" aria-hidden>*</span>
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby={id("date-label")}
                  className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                >
                  {availability.days.map((d) => {
                    const p = dayParts(d.date);
                    const free = Object.values(d.slots).filter(Boolean).length;
                    const active = d.date === date;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={!d.open}
                        onClick={() => {
                          setDate(d.date);
                          setSlot("");
                        }}
                        className={cn(
                          "flex min-h-16 w-[4.75rem] shrink-0 snap-start flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition-colors",
                          active
                            ? "border-navy-900 bg-navy-900 text-white"
                            : d.open
                              ? "border-line bg-white text-navy-900 hover:border-brand-500"
                              : "cursor-not-allowed border-line bg-mist text-muted",
                        )}
                      >
                        <span className="text-xs font-bold tracking-wide uppercase">{p.weekday}</span>
                        <span className="font-display text-base font-extrabold">{p.date}</span>
                        <span className={cn("text-xs", active ? "text-white/80" : d.open ? "text-emerald-700" : "text-muted")}>
                          {d.open ? `${free} free` : d.closed ? "Closed" : "Full"}
                        </span>
                      </button>
                    );
                  })}
                  {canLoadMore && (
                    <button
                      type="button"
                      onClick={() => void load(addDays(lastLoaded!, 1), true)}
                      className="flex min-h-16 w-[4.75rem] shrink-0 items-center justify-center rounded-xl border border-dashed border-line px-2 text-sm font-semibold text-brand-600 hover:border-brand-500"
                    >
                      Later dates
                    </button>
                  )}
                </div>
                {!availability.days.some((d) => d.open) && (
                  <p className="mt-2 text-base text-muted">No free slots in these dates — try later dates or call us on {business.phone.display}.</p>
                )}
              </div>

              {selectedDay && (
                <div>
                  <p id={id("slot-label")} className="mb-2 font-display text-[0.9375rem] font-bold text-ink">
                    Time slot on {dayParts(selectedDay.date).long}
                    <span className="ml-0.5 text-accent-600" aria-hidden>*</span>
                  </p>
                  <div role="radiogroup" aria-labelledby={id("slot-label")} {...aria(errors, "slot_start", id("slot"))} className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-3">
                    {TIME_SLOTS.map((t) => {
                      const free = selectedDay.slots[t.start];
                      return (
                        <label key={t.start} className={free ? "cursor-pointer" : "cursor-not-allowed"}>
                          <input
                            type="radio"
                            name="slot_start"
                            value={t.start}
                            disabled={!free}
                            checked={slot === t.start}
                            onChange={() => setSlot(t.start)}
                            className="peer sr-only"
                          />
                          <span
                            className={cn(
                              "flex min-h-12 flex-col items-center justify-center rounded-lg border px-3 py-1.5 text-center font-display font-bold transition-colors",
                              free
                                ? "border-line bg-white text-navy-900 peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500"
                                : "border-line bg-mist text-muted",
                              errors.slot_start && free && "border-red-600",
                            )}
                          >
                            {slotLabel(t.start)}
                            {!free && <span className="text-xs font-semibold">Slot not available</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
          <FieldError id={id("slot")} message={errors.slot_start} />
        </fieldset>

        <div className="space-y-5 border-t border-line pt-6">
          <ConsentCheckbox id={id("consent")} error={errors.consent} />
          {status === "error" && <FormError message={message} />}
          <SubmitButton submitting={submitting} busyLabel="Booking…" icon={<CalendarCheck className="size-5" aria-hidden />}>
            Confirm booking
          </SubmitButton>
          {date && slot && (
            <p className="text-base text-muted">
              You&rsquo;re booking <strong className="text-ink">{ref || "—"}</strong> on <strong className="text-ink">{dayParts(date).long}</strong>,{" "}
              <strong className="text-ink">{slotLabel(slot)}</strong>.
            </p>
          )}
          <RecaptchaNotice />
        </div>
      </form>
    </div>
  );
}
