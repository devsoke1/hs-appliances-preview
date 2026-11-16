"""
Rebuild site logos, favicons and the default OG image from the brand PDF.

Source: assets/brand/HS-Appliances-Logo.pdf
  page 1 — wordmark for light backgrounds
  page 2 — wordmark for dark backgrounds

    python scripts/extract-logo.py
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "assets" / "brand" / "HS-Appliances-Logo.pdf"
SCALE = 8


def render(page_index: int) -> np.ndarray:
    doc = pymupdf.open(PDF)
    pix = doc[page_index].get_pixmap(matrix=pymupdf.Matrix(SCALE, SCALE), alpha=False)
    return np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3).copy()


def main() -> None:
    if not PDF.exists():
        raise SystemExit(f"Missing brand PDF: {PDF}")

    light = render(0)
    dark = render(1)

    dist = (255 - light.min(axis=2)).astype(np.int16)
    light_alpha = np.clip((dist - 8) * 12, 0, 255).astype(np.uint8)
    ys, xs = np.where(light_alpha > 24)
    pad = 8
    box = (
        int(xs.min()) - pad,
        int(ys.min()) - pad,
        int(xs.max()) + pad,
        int(ys.max()) + pad,
    )
    l, t, r, b = box

    def cut(color: np.ndarray, alpha: np.ndarray) -> Image.Image:
        return Image.fromarray(np.dstack([color[t : b + 1, l : r + 1], alpha[t : b + 1, l : r + 1]]), "RGBA")

    full_light = cut(light, light_alpha)

    bg = np.array([10, 26, 46], dtype=np.int16)
    diff = np.abs(dark.astype(np.int16) - bg).max(axis=2)
    dark_alpha = np.clip((diff - 14) * 8, 0, 255).astype(np.uint8)
    full_dark = cut(dark, dark_alpha)

    images = ROOT / "public" / "images"
    images.mkdir(parents=True, exist_ok=True)
    full_light.save(images / "logo.png", "PNG", optimize=True)
    full_dark.save(images / "logo-on-dark.png", "PNG", optimize=True)

    cols = (light_alpha[t : b + 1, l : r + 1] > 24).any(axis=0)
    gaps: list[tuple[int, int, int]] = []
    start = None
    for i, on in enumerate(cols):
        if not on:
            if start is None:
                start = i
        elif start is not None:
            gaps.append((start, i, i - start))
            start = None
    split = next(g[0] for g in gaps if g[2] > 40)
    mark = full_light.crop((0, 0, split, full_light.height))
    ma = np.array(mark.split()[-1])
    mys, mxs = np.where(ma > 24)
    mark = mark.crop((int(mxs.min()), int(mys.min()), int(mxs.max()) + 1, int(mys.max()) + 1))
    mark.save(images / "mark.png", "PNG", optimize=True)

    def square_icon(size: int) -> Image.Image:
        canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        ratio = min((size * 0.78) / mark.width, (size * 0.58) / mark.height)
        resized = mark.resize((max(1, int(mark.width * ratio)), max(1, int(mark.height * ratio))), Image.Resampling.LANCZOS)
        canvas.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
        return canvas.convert("RGB")

    square_icon(512).save(ROOT / "public" / "icon-512.png", "PNG", optimize=True)
    square_icon(192).save(ROOT / "public" / "icon-192.png", "PNG", optimize=True)
    square_icon(180).save(ROOT / "src" / "app" / "apple-icon.png", "PNG", optimize=True)
    square_icon(512).save(ROOT / "src" / "app" / "icon.png", "PNG", optimize=True)

    og = Image.new("RGB", (1200, 630), (0, 36, 58))
    draw = ImageDraw.Draw(og)
    draw.rectangle((0, 618, 1200, 630), fill=(242, 92, 0))
    logo = full_dark.resize((980, max(1, int(full_dark.height * (980 / full_dark.width)))), Image.Resampling.LANCZOS)
    canvas = og.convert("RGBA")
    canvas.alpha_composite(logo, ((1200 - logo.width) // 2, 168))
    og = canvas.convert("RGB")
    draw = ImageDraw.Draw(og)
    font = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 30)
    font_b = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 32)

    def center(text: str, face: ImageFont.FreeTypeFont, y: int, fill: tuple[int, int, int]) -> None:
        bb = draw.textbbox((0, 0), text, font=face)
        draw.text(((1200 - (bb[2] - bb[0])) / 2, y), text, font=face, fill=fill)

    center("Feltham  ·  West London  ·  07777 372586", font_b, 400, (255, 132, 69))
    center("hsappliances.co.uk", font, 452, (220, 228, 236))
    og_dir = ROOT / "public" / "og"
    og_dir.mkdir(parents=True, exist_ok=True)
    og.save(og_dir / "default.png", "PNG", optimize=True)
    print("logo, icons and OG image written")


if __name__ == "__main__":
    main()
