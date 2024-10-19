export class M_Gates5 {
  aSticks: { color: string; x: number; y: number, scenex: number, sceney: number, d:number }[] = [];
  mH: number = 2;
  mW: number = 0.30;

  constructor() {
    this.aSticks = [
      { color: "red", x: 14, y: 5, scenex: 0, sceney: 0, d: 0 },
      { color: "red", x: 16, y: 5, scenex: 0, sceney: 0, d: 0 },
      { color: "green", x: 5, y: 10, scenex: 0, sceney: 0, d: 0 },
      { color: "green", x: 7, y: 10, scenex: 0, sceney: 0, d: 0 },
      { color: "green", x: 9, y: 12, scenex: 0, sceney: 0, d: 0 },
      { color: "green", x: 11, y: 12, scenex: 0, sceney: 0, d: 0 },
      { color: "red", x: 23, y: 15, scenex: 0, sceney: 0, d: 0 },
      { color: "red", x: 25, y: 15, scenex: 0, sceney: 0, d: 0 },
      { color: "green", x: 5, y: 20, scenex: 0, sceney: 0, d: 0 },
      { color: "green", x: 7, y: 20, scenex: 0, sceney: 0, d: 0 },
    ];


  }
}