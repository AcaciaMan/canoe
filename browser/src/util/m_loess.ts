import * as ss from "simple-statistics";

export class Loess {
  private bandwidth: number;

  constructor(bandwidth: number) {
    this.bandwidth = bandwidth;
  }

  smooth(x: number[], y: Uint8Array): Int16Array {
    const n = x.length;
    const smoothed = new Int16Array(n);

    for (let i = 0; i < n; i++) {
      const weights = this.calculateWeights(x, x[i]);
      const weightedY = [...y].map((yi, idx) => yi * weights[idx]);
      const weightedX = [...x].map((xi, idx) => xi * weights[idx]);
      const weightedX2 = [...x].map((xi, idx) => xi * xi * weights[idx]);

      const sumWeights = ss.sum(weights);
      const sumWeightedY = ss.sum(weightedY);
      const sumWeightedX = ss.sum(weightedX);
      const sumWeightedX2 = ss.sum(weightedX2);

      const meanX = sumWeightedX / sumWeights;
      const meanY = sumWeightedY / sumWeights;

      const beta =
        (sumWeightedY - meanY * sumWeights) /
        (sumWeightedX2 - meanX * sumWeightedX);
      const alpha = meanY - beta * meanX;
      smoothed[i] = Math.floor(alpha + beta * x[i]);
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
