import sharp from "sharp";

function overlay(width: number, height: number) {
  const font = Math.max(18, Math.round(Math.min(width, height) / 16));
  const texts: string[] = [];
  for (let y = -height; y < height * 2; y += font * 3.4) {
    for (let x = -width; x < width * 2; x += font * 11) {
      texts.push(
        `<text x="${x}" y="${y}" transform="rotate(-28 ${x} ${y})">FLOW WITH THE TREND</text>`,
      );
    }
  }
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        text {
          font-family: Arial, Helvetica, sans-serif;
          font-size: ${font}px;
          font-weight: 700;
          letter-spacing: 0.08em;
          fill: rgba(255, 255, 255, 0.42);
          stroke: rgba(22, 22, 22, 0.38);
          stroke-width: 1;
        }
      </style>
      ${texts.join("")}
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

  return prepared
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .composite([{ input: overlay(width, height), blend: "over" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
