import { M_PreCalcLoess } from "./m_pre_calc_loess";

export class Loess {
  private bandwidth: number;

  constructor(bandwidth: number) {
    this.bandwidth = bandwidth;
  }

  mPreCalcLoess: M_PreCalcLoess = M_PreCalcLoess.getInstance();
  weightedY = new Float32Array(this.mPreCalcLoess.around[0]*2).fill(0);
  sumWeightedY = new Float32Array(1);
  meanY = new Float32Array(1);
  beta = new Float32Array(1);
  alpha = new Float32Array(1);

  smooth(y: Uint8Array): Int16Array {
    const n = y.length;
    const smoothed = new Int16Array(n);
    for (let i = 0; i < n; i++) {
      const around = y.slice(
        Math.max(0, i - this.mPreCalcLoess.around[0]),
        Math.min(n, i + this.mPreCalcLoess.around[0])
      );
      if (around.length < this.mPreCalcLoess.around[0] * 2) {
        smoothed[i] = y[i];
        continue;
      }
      const weights = this.mPreCalcLoess.getWeights();
      this.weightedY = this.weightedY.map((_, idx) => around[idx] * weights[idx]); 
      this.sumWeightedY[0] = this.weightedY.reduce((acc, val) => acc + val, 0);
      this.meanY[0] =
        this.sumWeightedY[0] / this.mPreCalcLoess.getSumWeights()[0];
      this.beta[0] =
        (this.sumWeightedY[0] -
          this.meanY[0] * this.mPreCalcLoess.getSumWeights()[0]) /
        (this.mPreCalcLoess.getSumWeightedX2()[0] -
          this.mPreCalcLoess.getMeanX()[0] *
            this.mPreCalcLoess.getSumWeightedX()[0]);
      this.alpha[0] =
        this.meanY[0] - this.beta[0] * this.mPreCalcLoess.getMeanX()[0];
      smoothed[i] = Math.floor(
        this.alpha[0] + this.beta[0] * this.mPreCalcLoess.around[0]
      );
    }
    return smoothed;
  }
}
