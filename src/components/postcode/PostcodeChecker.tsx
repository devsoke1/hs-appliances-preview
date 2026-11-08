import { areaIndex } from "@/data/areas";
import { business, telHref } from "@/data/business";
import { PostcodeCheckerClient } from "./PostcodeCheckerClient";

/** Server wrapper: passes a slim area index so area copy stays out of the client bundle. */
export function PostcodeChecker({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <PostcodeCheckerClient index={areaIndex()} phoneDisplay={business.phone.display} telHref={telHref} tone={tone} className={className} />
  );
}
