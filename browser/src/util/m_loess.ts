import { M_PreCalcLoess } from "./m_pre_calc_loess";

export class Loess {
  private bandwidth: number;

  constructor(bandwidth: number) {
    this.bandwidth = bandwidth;
  }

  mPreCalcLoess: M_PreCalcLoess = M_PreCalcLoess.getInstance();


  smooth(y: Uint8Array): Int16Array {
    const n = y.length;
    const smoothed = new Int16Array(n);
    for (let i = 0; i < n; i++) {
    const around = y.slice(Math.max(0, i - this.mPreCalcLoess.around), Math.min(n, i + this.mPreCalcLoess.around));
    if (around.length < this.mPreCalcLoess.around * 2) {
      smoothed[i] = y[i];
      continue;
    }
    const weights = this.mPreCalcLoess.getWeights();
    const weightedY = [...around].map((yi, idx) => yi * weights[idx]);
    const sumWeightedY = weightedY.reduce((acc, val) => acc + val, 0);
    const meanY = sumWeightedY / this.mPreCalcLoess.getSumWeights();
    const beta =
      (sumWeightedY - meanY * this.mPreCalcLoess.getSumWeights()) /
      (this.mPreCalcLoess.getSumWeightedX2() -
      this.mPreCalcLoess.getMeanX() * this.mPreCalcLoess.getSumWeightedX());
    const alpha = meanY - beta * this.mPreCalcLoess.getMeanX();
    smoothed[i] = Math.floor(alpha + beta * this.mPreCalcLoess.around);
    }
    return smoothed;

  }

}
