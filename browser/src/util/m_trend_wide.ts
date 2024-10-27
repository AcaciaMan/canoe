import { M_Trend } from "./m_trend";

// class extends m_trend.ts
export class M_TrendWide extends M_Trend {
  // singleton
  private static instanceWide: M_TrendWide;
  public constructor() {
    super();
  }
  static getInstance() {
    if (!M_TrendWide.instanceWide) {
      M_TrendWide.instanceWide = new M_TrendWide();
    }
    return M_TrendWide.instanceWide;
  }


  async combineArrays(arr1: Int16Array, arr2: Uint8Array, arr3: Uint8Array, arr4: Uint8Array, result: Uint8Array): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        let k = 0;
      for (let i = 0; i < arr1.length/2; i++) {
        if (arr4[i] === 1) {
        result[k] = arr1[i] + arr2[i] - arr3[i];
        k++;
        result[k] = arr1[i] + arr2[i] - arr3[i];
        k++;
        } else {
          result[k] = arr1[i] + arr2[i] + arr3[i];
            k++;
            result[k] = arr1[i] + arr2[i] + arr3[i];
            k++;
        }
      }
      resolve();
    });
  }
}