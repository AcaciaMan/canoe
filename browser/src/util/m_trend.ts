import sharp from "sharp";
import ndarray from "ndarray";
import { TimeSeries } from "timeseries-analysis";
//const TimeSeries = require("timeseries-analysis").TimeSeries;

import { add } from "ndarray-ops";

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
    trend: number[];
    seasonal: number[];
    residual: number[];
  }[] = [];
  dg: {
    trend: number[];
    seasonal: number[];
    residual: number[];
  }[] = [];
  db: {
    trend: number[];
    seasonal: number[];
    residual: number[];
  }[] = [];

  async load_image(pngPath: string) {
    if (!this.data || !this.info) {
      const image = sharp(pngPath);
      const { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });
      this.data = data;
      this.info = info;

      // make number arrays for each channel each row
      const rgbPoints = [];
      for (let y = 0; y < info.height; y++) {
        const row = [];
        for (let x = 0; x < info.width; x++) {
          const index = (y * info.width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          row.push([r, g, b]);
        }
        rgbPoints.push(row);
      }

      // decompose each row into trend, seasonal, and residual
      let decomposed = rgbPoints.map((row) =>
        this.decomposeTimeSeries(row.map(([r, g, b]) => r))
      );
      this.dr = decomposed.map(({ trend, seasonal, residual }) => ({
        trend,
        seasonal,
        residual,
      }));

      decomposed = rgbPoints.map((row) =>
        this.decomposeTimeSeries(row.map(([r, g, b]) => g))
      );
      this.dg = decomposed.map(({ trend, seasonal, residual }) => ({
        trend,
        seasonal,
        residual,
      }));

      decomposed = rgbPoints.map((row) =>
        this.decomposeTimeSeries(row.map(([r, g, b]) => b))
      );
      this.db = decomposed.map(({ trend, seasonal, residual }) => ({
        trend,
        seasonal,
        residual,
      }));
    }
  }

  decomposeTimeSeries(data: number[]) {
    const t = new TimeSeries(data);

    const trend = t.smoother({ period: 50 }).data;
    const seasonal = t.detrend().smoother({ period: 50 }).data;
    const residual = data.map((d, i) => d - trend[i] - seasonal[i]);

    return { trend, seasonal, residual };
  }

  m_trend() {
    if (!this.data || !this.info) {
      throw new Error("Image not loaded");
    }

    const width = this.info.width;
    const height = this.info.height;

    // process the image
    const { outR, outG, outB } = this.processImage(width, height);

    // convert the result to a buffer
    const data = Buffer.alloc(this.info.width * this.info.height * 3);
    for (let y = 0; y < this.info.height; y++) {
      for (let x = 0; x < this.info.width; x++) {
        const index = (y * this.info.width + x) * 3;
        data[index] = outR.get(y, x);
        data[index + 1] = outG.get(y, x);
        data[index + 2] = outB.get(y, x);
      }
    }

    return data;
  }

  processImage(
    width: number,
    height: number
  ): { outR: any; outG: any; outB: any } {
    // Flatten the trend arrays
    const drFlat = this.dr.flatMap(({ trend }) => trend);
    const dgFlat = this.dg.flatMap(({ trend }) => trend);
    const dbFlat = this.db.flatMap(({ trend }) => trend);

    // Create ndarray instances
    const dr = ndarray(Array.from(new Float32Array(drFlat)), [height, width]);
    const dg = ndarray(Array.from(new Float32Array(dgFlat)), [height, width]);
    const db = ndarray(Array.from(new Float32Array(dbFlat)), [height, width]);

    // Create output ndarrays
    const outR = ndarray(Array.from(new Float32Array(width * height)), [
      height,
      width,
    ]);
    const outG = ndarray(Array.from(new Float32Array(width * height)), [
      height,
      width,
    ]);
    const outB = ndarray(Array.from(new Float32Array(width * height)), [
      height,
      width,
    ]);

    // Add the trend of each channel
    add(outR, outR, dr);
    add(outG, outG, dg);
    add(outB, outB, db);

    return { outR, outG, outB };
  }
}