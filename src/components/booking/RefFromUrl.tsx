"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { selectBookingRef } from "@/lib/booking";

/**
 * Passes ?service= / ?ref= to the booking form when the query changes without a page load
 * (e.g. choosing "Servicing" in the header while already on /air-conditioning/).
 * Rendered inside <Suspense> so the rest of the page stays static.
 */
export function RefFromUrl() {
  const params = useSearchParams();
  const value = params.get("ref") ?? params.get("service");
  useEffect(() => {
    if (value) selectBookingRef(value);
  }, [value]);
  return null;
}
