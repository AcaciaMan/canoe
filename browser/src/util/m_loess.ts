import * as ss from "simple-statistics";
import { M_PreCalcLoess } from "./m_pre_calc_loess";

export class Loess {
  private bandwidth: number;

  constructor(bandwidth: number) {
    this.bandwidth = bandwidth;
  }

  mPreCalcLoess: M_PreCalcLoess = M_PreCalcLoess.getInstance();

  smooth(x: number[], y: Uint8Array): Int16Array {
    const n = x.length;
    const smoothed = new Int16Array(n);

    for (let i = 0; i < n; i++) {
      const around = y.filter((_, idx) => Math.abs(i - idx) <= this.mPreCalcLoess.around);
      if (around.length < this.mPreCalcLoess.around*2) {
        smoothed[i] = y[i];
        continue;
      }
      const weights = this.mPreCalcLoess.getWeights();
      
      const weightedY = [...around].map((yi, idx) => yi * weights[idx]);
      const sumWeightedY = ss.sum(weightedY);

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

  calculateWeights(x: number[], xi: number): number[] {
    const n = x.length;
    const weights = new Array(n).fill(0);
    const maxDistance = 50;
    const startIdx = Math.max(0, xi - 30);
    const endIdx = Math.min(xi + 30, n);

    for (let i = startIdx; i < endIdx; i++) {
      const distance = Math.abs(i-xi)/maxDistance;
        weights[i] = Math.pow(1 - Math.pow(distance, 3), 3);
    }

    return weights;
  }
}
