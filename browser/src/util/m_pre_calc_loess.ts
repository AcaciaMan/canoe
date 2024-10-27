import * as ss from "simple-statistics";

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

  weights: number[] | undefined;
  maxDistance = 50;
  around = 30;
  sumWeights: number | undefined;
  weightedX: number[] | undefined;
  weightedX2: number[] | undefined;
  sumWeightedX: number | undefined;
    sumWeightedX2: number | undefined;
    meanX: number | undefined;
randomNumbers: number[] = Array.from({ length: 11 }, () => Math.random());
ith = 0;

  getWeights() {
    if (this.weights === undefined) {
      this.weights = this.calculateWeights();
    }
    return this.weights;
  }

  getSumWeights() {
    if (this.sumWeights === undefined) {
      this.sumWeights = ss.sum(this.getWeights());
    }
    return this.sumWeights;
  }

  // calculate weights for loess smoothing
  calculateWeights() {
    const n = this.around * 2+1;
    const weights = new Array(n);
    const startIdx = 0;
    const endIdx = n;
    for (let i = startIdx; i < endIdx; i++) {
      const distance = Math.abs(i - this.around) / this.maxDistance;
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
        this.sumWeightedX = ss.sum(this.getWeightedX());
        }
        return this.sumWeightedX;
    }

    getSumWeightedX2() {
        if (this.sumWeightedX2 === undefined) {
        this.sumWeightedX2 = ss.sum(this.getWeightedX2());
        }
        return this.sumWeightedX2;
    }

    getMeanX() {
        if (this.meanX === undefined) {
        this.meanX = this.getSumWeightedX() / this.getSumWeights();
        }
        return this.meanX;
    }

    getRandomMultiplication(n: number) {
        this.ith++;
        if (this.ith === 11) {
        this.ith = 0;
        }
        return this.randomNumbers[this.ith] * n;
    }




}
