import { Loess } from "./m_loess";

export class STL {
  private loess: Loess;
  private period: number;
  private seasonal: Int16Array = new Int16Array(0);
  private trend: Uint8Array = new Uint8Array(0);
  private residual: Uint8Array = new Uint8Array(0);
  private mSign: Uint8Array = new Uint8Array(0);

  constructor(period: number, bandwidth: number) {
    this.period = period;
    this.loess = new Loess(bandwidth);
  }

  decompose(data: Uint8Array): {
    seasonal: Int16Array;
    trend: Uint8Array;
    residual: Uint8Array;
    mSign: Uint8Array;
  } {
    const n = data.length;
    this.seasonal = new Int16Array(n);
    this.trend = new Uint8Array(n);
    this.residual = new Uint8Array(n);
    this.mSign = new Uint8Array(n);

    // Initial seasonal component estimation
    for (let i = 0; i < this.period; i++) {
      const seasonalData = data.filter((_, idx) => idx % this.period === i);
      const smoothed = this.loess.smooth(
        seasonalData
      );
      for (let j = 0; j < smoothed.length; j++) {
        this.seasonal[i + j * this.period] = smoothed[j];
      }
    }

      // Detrend data
      const detrended = this.seasonal.map((d,i) => -d + data[i]);
      const detrendedUint8 = new Uint8Array(n);
      detrended.forEach((d, i) => (detrendedUint8[i] = Math.max(0,Math.min(255,d))));

      // Estimate trend component
      const smoothTrend = this.loess.smooth(
         detrendedUint8
      );

      smoothTrend.forEach((d, i) => (this.trend[i] = Math.max(0,Math.min(255,d))));

    // Calculate residual component
    for (let i = 0; i < n; i++) {
      const resid = data[i] - this.seasonal[i] - this.trend[i];
      if (resid < 0) {
        this.mSign[i] = 1;
        this.residual[i] = Math.min(-resid, 255);
      } else {
        this.mSign[i] = 0;
        this.residual[i] = Math.min(resid, 255);
      }
    }
    return {
      seasonal: this.seasonal,
      trend: this.trend,
      residual: this.residual,
      mSign: this.mSign,
    };
  }
}
