export class M_Gates5 {
  aSticks: { color: string; x: number; y: number }[] = [];
  mH: number = 2;
  mW: number = 0.30;

  constructor() {
    this.aSticks = [
      { color: "red", x: 14, y: 5 },
      { color: "red", x: 16, y: 5 },
      { color: "green", x: 5, y: 10},
      { color: "green", x: 7, y: 10 },
        { color: "green", x: 9, y: 12 },
        { color: "green", x: 11, y: 12 },
        { color: "red", x: 23, y: 15 },
        { color: "red", x: 25, y: 15 },
        { color: "green", x: 5, y: 20 },
        { color: "green", x: 7, y: 20 }
    ];


  }
}