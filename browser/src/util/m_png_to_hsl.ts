import sharp from "sharp";

export class M_PngToHsl {
    constructor() {
    }

    // convert png to rgb
    async convertPngToRgb(pngPath: string) {
  try {
    const image = sharp(pngPath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rgbPoints = [];
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const index = (y * info.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        rgbPoints.push({ x, y, r, g, b });
      }
    }

    return rgbPoints;
  } catch (error) {
    console.error("Error processing image:", error);
    return [];
  }    }

  rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// convert png to hsl
async convertPngToHsl(pngPath: string) {
  const rgbPoints = await this.convertPngToRgb(pngPath);
  const hslPoints = rgbPoints.map(({ r, g, b, ...rest }) => {
    const [h, s, l] = this.rgbToHsl(r, g, b);
    return { h, s, l, ...rest };
  });

  return hslPoints;
}
}