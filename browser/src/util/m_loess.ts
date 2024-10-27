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

    let totalFilter = 0;
    let totalEndedWeights = 0;
    let totalEndedSumWeightedY = 0;
    let totalEndedMeanY = 0;
    let totalEndedBeta = 0;
    let totalEndedAlpha = 0;

    for (let i = 0; i < n; i++) {
      const startedFilter = performance.now();
      const around = y.slice(Math.max(0, i - this.mPreCalcLoess.around), Math.min(n, i + this.mPreCalcLoess.around));
      const endedFilter = performance.now();
      totalFilter += endedFilter - startedFilter;
      if (around.length < this.mPreCalcLoess.around*2) {
        smoothed[i] = y[i];
        continue;
      }
      const weights = this.mPreCalcLoess.getWeights();
      
      const startedWeights = performance.now();
      const weightedY = [...around].map((yi, idx) => yi * weights[idx]);
      const endedWeights = performance.now();
      totalEndedWeights += endedWeights - startedWeights;
      const sumWeightedY = weightedY.reduce((acc, val) => acc + val, 0);
      const endedSumWeightedY = performance.now();
      totalEndedSumWeightedY += endedSumWeightedY - endedWeights;

      const meanY = sumWeightedY / this.mPreCalcLoess.getSumWeights();
      const endedMeanY = performance.now();
      totalEndedMeanY += endedMeanY - endedSumWeightedY;


      const beta =
        (sumWeightedY - meanY * this.mPreCalcLoess.getSumWeights()) /
        (this.mPreCalcLoess.getSumWeightedX2() -
          this.mPreCalcLoess.getMeanX() * this.mPreCalcLoess.getSumWeightedX());
      const endedBeta = performance.now();
      totalEndedBeta += endedBeta - endedMeanY;    
      const alpha = meanY - beta * this.mPreCalcLoess.getMeanX();
      const endedAlpha = performance.now();
      totalEndedAlpha += endedAlpha - endedBeta;
      smoothed[i] = Math.floor(alpha + beta * this.mPreCalcLoess.around);
    }

    console.log(`totalFilter: ${totalFilter}`);
    console.log(`totalEndedWeights: ${totalEndedWeights}`);
    console.log(`totalEndedSumWeightedY: ${totalEndedSumWeightedY}`);
    console.log(`totalEndedMeanY: ${totalEndedMeanY}`);
    console.log(`totalEndedBeta: ${totalEndedBeta}`);
    console.log(`totalEndedAlpha: ${totalEndedAlpha}`);

    return smoothed;
  }

}
