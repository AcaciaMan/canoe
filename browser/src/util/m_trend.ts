import sharp from "sharp";
import { STL } from "./m_stl";
import { M_PreCalcLoess } from "./m_pre_calc_loess";

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
    output: Uint8Array;
  }[] = [];
  dg: {
    observed: Uint8Array;
    trend: Uint8Array;
    seasonal: Int16Array;
    residual: number[];
    output: Uint8Array;
  }[] = [];
  db: {
    observed: Uint8Array;
    trend: Uint8Array;
    seasonal: Int16Array;
    residual: number[];
    output: Uint8Array;
  }[] = [];
  mPreCalcLoess: M_PreCalcLoess = M_PreCalcLoess.getInstance();

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
        output: new Uint8Array(info.width),
      }));
      this.dg = Array.from({ length: info.height }, () => ({
        observed: new Uint8Array(info.width),
        trend: new Uint8Array(info.width),
        seasonal: new Int16Array(info.width),
        residual: new Array(info.width),
        output: new Uint8Array(info.width),
      }));
      this.db = Array.from({ length: info.height }, () => ({
        observed: new Uint8Array(info.width),
        trend: new Uint8Array(info.width),
        seasonal: new Int16Array(info.width),
        residual: new Array(info.width),
        output: new Uint8Array(info.width),
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
      /*
      const start = new Date().getTime();
      let observed = this.dr[0].observed;
        const { seasonal, trend, residual } = stl.decompose(
          observed
        );
        const end = new Date().getTime();
        console.log(`Decompsoe time: ${end - start} ms`, observed.length);
        console.log(seasonal);
        console.log(trend);
        console.log(residual);
      */

      
      
      for (let y = 0; y < info.height; y++) {
        let { seasonal, trend, residual } = stl.decompose(
          this.dr[y].observed
        );
        this.dr[y].seasonal = seasonal;
        this.dr[y].trend = trend;
        this.dr[y].residual = residual;

        ({ seasonal, trend, residual } = stl.decompose(
          this.dg[y].observed
        ));
        this.dg[y].seasonal = seasonal;
        this.dg[y].trend = trend;
        this.dg[y].residual = residual;

        ({ seasonal, trend, residual } = stl.decompose(
          this.db[y].observed
        ));
        this.db[y].seasonal = seasonal;
        this.db[y].trend = trend;
        this.db[y].residual = residual;
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

  const promises = [];
  for (let y = 0; y < height; y++) {
    promises.push(this.combineArrays(this.dr[y].seasonal, this.dr[y].trend, this.dr[y].residual).then(result => {
      this.dr[y].output = result;
    }));
    promises.push(this.combineArrays(this.dg[y].seasonal, this.dg[y].trend, this.dg[y].residual).then(result => {
      this.dg[y].output = result;
    }));
    promises.push(this.combineArrays(this.db[y].seasonal, this.db[y].trend, this.db[y].residual).then(result => {
      this.db[y].output = result;
    }));
  }

  return Promise.all(promises).then(() => {
    let index = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        data[index++] = this.dr[y].output[x];
        data[index++] = this.dg[y].output[x];
        data[index++] = this.db[y].output[x];
      }
    }

    return data;
  });
  }

  async combineArrays(
    arr1: Int16Array,
    arr2: Uint8Array,
    arr3: number[]
  ) {
    return new Promise<Uint8Array>((resolve, reject) => {
 
        const result = new Uint8Array(arr1.length);
        for (let i = 0; i < arr1.length; i++) {
          result[i] = Math.min(255, Math.max(0, arr1[i] + arr2[i] + arr3[i]));
        }
        resolve(result);
    });
  }


}