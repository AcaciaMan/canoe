import path from "path";
import { Loess } from "../util/m_loess";
import { STL } from "../util/m_stl";
import { M_Trend } from "../util/m_trend";
import { M_PreCalcLoess } from "../util/m_pre_calc_loess";

describe("M_Loess", () => {
    let loess: Loess;
    
    beforeEach(() => {
        loess = new Loess(0.7);
    });
    
  
    test("smooth should calculate the correct smoothed values", () => {
        const x = [1, 2, 3, 4, 5];
        const y = new Uint8Array([10, 20, 30, 40, 50]);

        const result = loess.smooth( y);
        console.log(result);
    });

    test("arrays should be the same length", () => {
        const a = new Uint8Array([4, 5, 6]);
        const b = [...a].map((_,idx) => idx);
        console.log(b);
    });

    test("loess", () => {
        const y = new Uint8Array(1337).map(() => Math.floor(Math.random() * 256));
        const mPre = M_PreCalcLoess.getInstance();
        console.log(mPre.getWeights());
        console.log(mPre.getSumWeights());

        const start = new Date().getTime();
        const result = loess.smooth(y);
        const end = new Date().getTime();
        console.log(`Execution time: ${end - start} ms`);
        console.log(result);
    });

    test("stl", () => {
        // populate data with 500 random Uint8 values
        const data = new Uint8Array(1330).map(() => Math.floor(Math.random() * 256));
        const period = 2;
        const bandwidth = 0.7;
        const stl = new STL(period, bandwidth);
        const start = new Date().getTime();
        const result = stl.decompose(data);
        const end = new Date().getTime();
        console.log(`Execution time: ${end - start} ms`);
        console.log(result);
    });

    test("image", async () => {
        const mTrend = M_Trend.getInstance();
          const pngPath = path.join(
            __dirname,
            "../../public",
            "resources",
            "gates.png"
          );
          console.log(pngPath);
        const start = new Date().getTime();
          await mTrend.load_image(pngPath);
          console.log(await mTrend.m_trend());
        const end = new Date().getTime();
        console.log(`Execution time: ${end - start} ms`);
            console.log("loaded image");

            return;


    }

);
})