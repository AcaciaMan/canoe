
export class M_PreCalcLoess {
  // singleton
  private static instance: M_PreCalcLoess;
  private constructor() {}
  static getInstance() {
    if (!M_PreCalcLoess.instance) {
      M_PreCalcLoess.instance = new M_PreCalcLoess();
    }
    return M_PreCalcLoess.instance;
  }

  weights: Float32Array | undefined;
  maxDistance = new Uint8Array(1).fill(50);
  around = new Uint8Array(1).fill(30);
  sumWeights: Float32Array | undefined;
  weightedX: Float32Array | undefined;
  weightedX2: Float32Array | undefined;
  sumWeightedX: Float32Array | undefined;
  sumWeightedX2: Float32Array | undefined;
  meanX: Float32Array | undefined;

  getWeights() {
    if (this.weights === undefined) {
      this.weights = this.calculateWeights();
    }
    return this.weights;
  }

  getSumWeights() {
    if (this.sumWeights === undefined) {
      this.sumWeights = new Float32Array(1);
      this.sumWeights[0] = this.getWeights().reduce((acc, val) => acc + val, 0);
    }
    return this.sumWeights;
  }

  // calculate weights for loess smoothing
  calculateWeights() {
    const n = this.around[0] * 2 + 1;
    const weights = new Float32Array(n);
    const startIdx = 0;
    const endIdx = n;
    for (let i = startIdx; i < endIdx; i++) {
      const distance = Math.abs(i - this.around[0]) / this.maxDistance[0];
      weights[i] = Math.pow(1 - Math.pow(distance, 3), 3);
    }
    return weights;
  }

  getWeightedX() {
    if (this.weightedX === undefined) {
      this.weightedX = this.getWeights().map((xi, idx) => xi * idx);
    }
    return this.weightedX;
  }

  getWeightedX2() {
    if (this.weightedX2 === undefined) {
      this.weightedX2 = this.getWeights().map((xi, idx) => xi * idx * idx);
    }
    return this.weightedX2;
  }

  getSumWeightedX() {
    if (this.sumWeightedX === undefined) {
      this.sumWeightedX = new Float32Array(1);
      this.sumWeightedX[0] = this.getWeightedX().reduce(
        (acc, val) => acc + val,
        0
      );
    }
    return this.sumWeightedX;
  }

  getSumWeightedX2() {
    if (this.sumWeightedX2 === undefined) {
      this.sumWeightedX2 = new Float32Array(1);
      this.sumWeightedX2[0] = this.getWeightedX2().reduce(
        (acc, val) => acc + val,
        0
      );
    }
    return this.sumWeightedX2;
  }

  getMeanX() {
    if (this.meanX === undefined) {
      this.meanX = new Float32Array(1);
      this.meanX[0] = this.getSumWeightedX()[0] / this.getSumWeights()[0];
    }
    return this.meanX;
  }
}
