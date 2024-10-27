import sharp from "sharp";
import { STL } from "./m_stl";

export class M_Trend {
  // singleton
  private static instance: M_Trend;
  private constructor() {}
  static getInstance() {
    if (!M_Trend.instance) {
      M_Trend.instance = new M_Trend();
    }
    return M_Trend.instance;
  }

  data: Buffer | undefined;
  info: sharp.OutputInfo | undefined;
  dr: {
    observed: Uint8Array;
    trend: Uint8Array;
    seasonal: Int16Array;
    residual: number[];
  }[] = [];
  dg: {
    observed: Uint8Array;
    trend: Uint8Array;
    seasonal: Int16Array;
    residual: number[];
  }[] = [];
  db: {
    observed: Uint8Array;
    trend: Uint8Array;
    seasonal: Int16Array;
    residual: number[];
  }[] = [];

  async load_image(pngPath: string) {
    if (this.data === undefined|| this.info === undefined) {
      const image = sharp(pngPath);
      const {data, info} = await image
        .raw()
        .toBuffer({ resolveWithObject: true });
          console.log(info);
      this.data = data;
      this.info = info;

      // initialize the observed, trend, seasonal, and residual arrays
      this.dr = Array.from({ length: info.height }, () => ({
        observed: new Uint8Array(info.width),
        trend: new Uint8Array(info.width),
        seasonal: new Int16Array(info.width),
        residual: new Array(info.width),
      }));
      this.dg = Array.from({ length: info.height }, () => ({
        observed: new Uint8Array(info.width),
        trend: new Uint8Array(info.width),
        seasonal: new Int16Array(info.width),
        residual: new Array(info.width),
      }));
      this.db = Array.from({ length: info.height }, () => ({
        observed: new Uint8Array(info.width),
        trend: new Uint8Array(info.width),
        seasonal: new Int16Array(info.width),
        residual: new Array(info.width),
      }));

      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          const index = (y * info.width + x) * 4;
          this.dr[y].observed[x] = data[index];
          this.dg[y].observed[x] = data[index + 1];
          this.db[y].observed[x] = data[index + 2];
        }
      }

      // Create STL instance
      const stl = new STL(2, 0.7);
      console.log("decomposing", stl);

      // decompose each row into trend, seasonal, and residual
      
      for (let y = 0; y < 1; y++) {
        const { seasonal, trend, residual } = stl.decompose(
          this.dr[y].observed
        );
        this.dr[y].seasonal = seasonal;
        this.dr[y].trend = trend;
        this.dr[y].residual = residual;
      }
      
  }
  }

  m_trend() {
    if (this.data === undefined || this.info === undefined) {
      throw new Error("Image not loaded");
    }

    const width = this.info.width;
    const height = this.info.height;

    // convert the result to a buffer
    const data = Buffer.alloc(this.info.width * this.info.height * 3);

    // combine the trend, seasonal, and residual into a single image
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 3;
        data[index] = this.dr[y].trend[x];
        data[index + 1] = this.dg[y].trend[x];
        data[index + 2] = this.db[y].trend[x];
      }
    }

    return data;
  }
}