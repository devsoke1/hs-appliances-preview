"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Click-to-load Google Map. Nothing is requested from Google (and no Google cookies are set)
 * until the visitor asks for the map — better for page speed and for privacy/consent.
 */
export function MapEmbed({ src, title, address }: { src: string; title: string; address: string }) {
  const [show, setShow] = useState(false);

  if (show) {
    return <iframe title={title} src={src} className="block aspect-[4/3] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />;
  }

  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      className="group relative grid aspect-[4/3] w-full place-items-center overflow-hidden bg-navy-900 bg-blueprint text-center text-white"
    >
      <span className="flex flex-col items-center gap-3 px-6">
        <span className="grid size-14 place-items-center rounded-full bg-accent-600 shadow-lg transition-transform group-hover:scale-105">
          <MapPin className="size-7" aria-hidden />
        </span>
        <span className="font-display text-lg font-bold">{address}</span>
        <span className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/25 group-hover:bg-white/15">Show map</span>
        <span className="text-xs text-white/70">Loads Google Maps, which may set cookies</span>
      </span>
    </button>
  );
}
