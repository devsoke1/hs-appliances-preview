import Link from "@/components/ui/SiteLink";
import { CalendarCheck, Phone } from "lucide-react";
import { telHref } from "@/data/business";

/** Fixed Call / Book bar on small screens. Body has `pb-mobile-bar` so content isn't hidden. */
export function MobileBottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgb(0_36_58/0.08)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a href={telHref} className="flex h-12 items-center justify-center gap-2 rounded-lg bg-navy-900 font-display font-bold text-white active:bg-navy-700">
          <Phone className="size-5" aria-hidden /> Call now
        </a>
        <Link href="/book/" className="flex h-12 items-center justify-center gap-2 rounded-lg bg-accent-600 font-display font-bold text-white active:bg-accent-700">
          <CalendarCheck className="size-5" aria-hidden /> Book now
        </Link>
      </div>
    </div>
  );
}
