declare module "opentype.js" {
  interface BrandGlyph {
    advanceWidth: number;
    getPath(x: number, y: number, fontSize: number): { toPathData(decimals?: number): string };
  }

  interface BrandFont {
    unitsPerEm: number;
    charToGlyph(char: string): BrandGlyph;
    getPath(text: string, x: number, y: number, fontSize: number): { toPathData(decimals?: number): string };
    getAdvanceWidth(text: string, fontSize: number): number;
  }

  const opentype: {
    parse(buffer: ArrayBuffer): BrandFont;
  };

  export default opentype;
}
