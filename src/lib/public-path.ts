/** Empty on the Hostinger build. Set only for the GitHub Pages preview. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public URL when the preview is served from a subpath. */
export function publicPath(path: string): string {
  if (!basePath || !path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
