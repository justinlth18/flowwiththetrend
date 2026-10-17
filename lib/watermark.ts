import { readFileSync } from "fs";
import path from "path";
import * as opentypeModule from "opentype.js";
import sharp from "sharp";

const opentype = ("default" in opentypeModule ? opentypeModule.default : opentypeModule) ?? opentypeModule;

const fontFile = readFileSync(path.join(process.cwd(), "lib/fonts/LilitaOne-Regular.ttf"));
const brandFont = opentype.parse(fontFile.buffer.slice(fontFile.byteOffset, fontFile.byteOffset + fontFile.byteLength));
const phrase = "FLOW WITH THE TREND";
const phraseSize = 120;
const glyphPaths: string[] = [];
let cursor = 0;
for (const char of phrase) {
  const glyph = brandFont.charToGlyph(char);
  const data = glyph.getPath(cursor, 0, phraseSize).toPathData(1);
  if (data) glyphPaths.push(data);
  cursor += (glyph.advanceWidth * phraseSize) / brandFont.unitsPerEm;
}
const phraseWidth = cursor;

function overlay(width: number, height: number) {
  const font = Math.max(26, Math.round(Math.min(width, height) / 16));
  const scale = font / phraseSize;
  const stepX = phraseWidth * scale + font * 8;
  const stepY = font * 7;
  const marks: string[] = [];
  for (let y = -height; y < height * 2; y += stepY) {
    for (let x = -width; x < width * 2; x += stepX) {
      marks.push(
        `<g transform="translate(${x} ${y}) rotate(-24) scale(${scale})">${glyphPaths.map((data) => `<path d="${data}"/>`).join("")}</g>`,
      );
    }
  }

  return Buffer.from(
    `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f4f4f4"/>
          <stop offset="46%" stop-color="#ffffff"/>
          <stop offset="54%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#d8d8d8"/>
        </linearGradient>
      </defs>
      <g fill="url(#shine)" opacity="0.22">${marks.join("")}</g>
    </svg>`,
  );
}

export async function watermarkImage(input: Buffer) {
  const prepared = sharp(input, { failOn: "none", animated: false }).rotate();
  const meta = await prepared.metadata();
  const sourceWidth = meta.width ?? 1200;
  const sourceHeight = meta.height ?? 800;
  const scale = Math.min(1, 1800 / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const resized = await prepared.resize(width, height, { fit: "inside", withoutEnlargement: true }).jpeg().toBuffer();
  const sized = await sharp(resized).metadata();
  const mark = await sharp(overlay(sized.width ?? width, sized.height ?? height)).png().toBuffer();

  return sharp(resized)
    .composite([{ input: mark, blend: "over" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
