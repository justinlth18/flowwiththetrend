import sharp from "sharp";

function overlay(width: number, height: number) {
  const font = Math.max(22, Math.round(Math.min(width, height) / 13));
  const texts: string[] = [];
  for (let y = -height; y < height * 2; y += font * 3.2) {
    for (let x = -width; x < width * 2; x += font * 12) {
      texts.push(
        `<text x="${x}" y="${y}" transform="rotate(-24 ${x} ${y})">FLOW WITH THE TREND</text>`,
      );
    }
  }

  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2c2c2c"/>
          <stop offset="40%" stop-color="#8d8d8d"/>
          <stop offset="47%" stop-color="#f7f7f7"/>
          <stop offset="50%" stop-color="#ffffff"/>
          <stop offset="53%" stop-color="#f2f2f2"/>
          <stop offset="60%" stop-color="#7a7a7a"/>
          <stop offset="100%" stop-color="#242424"/>
        </linearGradient>
      </defs>
      <g opacity="0.5" fill="url(#shine)" font-family="Arial, Helvetica, sans-serif" font-size="${font}" font-weight="700" letter-spacing="0.14em">
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

  return prepared
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .composite([{ input: overlay(width, height), blend: "over" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
