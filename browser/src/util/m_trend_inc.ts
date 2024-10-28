import { M_Trend } from "./m_trend";

export class M_TrendInc extends M_Trend {
  // singleton
  private static instanceInc: M_TrendInc;
  public constructor() {
    super();
  }
  static getInstance() {
    if (!M_TrendInc.instanceInc) {
      M_TrendInc.instanceInc = new M_TrendInc();
    }
    return M_TrendInc.instanceInc;
  }

  async combineArrays(
    arr1: Int16Array,
    arr2: Int16Array,
    arr3: Uint8Array,
    arr4: Uint8Array,
    result: Uint8Array,
    y: number
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let k = 0;
                    const randomByte = new Uint8Array(1)
                      .fill(0)
                      .map(() => Math.floor(Math.random() * 100));
      for (let i = 0; i < arr1.length; i++) {
        if (arr3[i] > 30 && i > 5) {
            const mSum = this.mRandomNumbers[randomByte[0] + i];
            arr3[i] = arr3[i-1-mSum];
        }
        if (arr4[i] === 1) {
          result[k] = arr1[i] + arr2[i] - arr3[i];
          k++;
          if (this.addPixel(y, i)) {
            result[k] = result[k - 1];
            k++;
          }
        } else {
          result[k] = arr1[i] + arr2[i] + arr3[i];
          k++;
          if (this.addPixel(y, i)) {
            result[k] = result[k - 1];
            k++;
          }
        }
        if (k >= result.length) {
          break;
        }
      }
      resolve();
    });
  }

  addPixel(y: number, i: number): boolean {
    let z = 40;

    if (y < 40) {
      z = 40;
      return i % z === 0;
    } else if (y > 500) {
      z = 2;
      return i % z === 0;
    } else {
      // if (y > 40 && y < 500) assign z proportionally between 40 and 2
      z = Math.ceil(40 - (y - 40) / 20);
      return i % z === 0;
    }
  }
}