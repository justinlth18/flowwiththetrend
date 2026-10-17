import { readFileSync } from "fs";
import path from "path";
import sharp from "sharp";

const brandFont = readFileSync(path.join(process.cwd(), "lib/fonts/LilitaOne-Regular.ttf")).toString("base64");

function overlay(width: number, height: number) {
  const font = Math.max(28, Math.round(Math.min(width, height) / 11));
  const texts: string[] = [];
  for (let y = -height; y < height * 2; y += font * 2.6) {
    for (let x = -width; x < width * 2; x += font * 13.5) {
      texts.push(
        `<text x="${x}" y="${y}" transform="rotate(-24 ${x} ${y})">FLOW WITH THE TREND</text>`,
      );
    }
  }

  return Buffer.from(
    `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face {
            font-family: "Brand";
            src: url("data:font/ttf;base64,${brandFont}");
          }
        </style>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#d7d7d7"/>
          <stop offset="38%" stop-color="#f3f3f3"/>
          <stop offset="47%" stop-color="#ffffff"/>
          <stop offset="53%" stop-color="#ffffff"/>
          <stop offset="62%" stop-color="#cfcfcf"/>
          <stop offset="100%" stop-color="#8f8f8f"/>
        </linearGradient>
      </defs>
      <g font-family="Brand" font-size="${font}" letter-spacing="0.04em" fill="url(#shine)" opacity="0.5">
        ${texts.join("")}
      </g>
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

  return sharp(resized)
    .composite([{ input: overlay(sized.width ?? width, sized.height ?? height), blend: "over" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
