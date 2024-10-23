export class M_Scene {
  //singleton
  private static instance: M_Scene;
  static getInstance() {
    if (!M_Scene.instance) {
      M_Scene.instance = new M_Scene();
    }
    return M_Scene.instance;
  }

  // constants for the scene - width and height
  width: number = 1000;
  height: number = 600;
  cmHeight: number = 18;

  horizon: number = 20;
  h = (this.height * this.horizon) / 100;

  depth: number = 100;

  perspective: number = 50;

  trackWidth: number = 30;
  trackLength: number = 300;

  sDelete = "";

  constructor() {}

  createSvg() {
    let s = "";
    this.sDelete = "";
    // draw a line for the horizon

    s += `<line x1="0" y1="${this.h}" x2="${this.width}" y2="${this.h}" stroke="black" stroke-width="1"/>`;
    this.sDelete += `<line x1="0" y1="${this.h}" x2="${this.width}" y2="${this.h}" stroke="white" stroke-width="1"/>`;

    // draw a line for the river
    s += `<line x1="0" y1="${this.height}" x2="${this.perspective}" y2="${this.h}" stroke="blue" stroke-width="1"/>`;
    this.sDelete += `<line x1="0" y1="${this.height}" x2="${this.perspective}" y2="${this.h}" stroke="white" stroke-width="1"/>`;

    s += `<line x1="${this.width}" y1="${this.height}" x2="${
      this.width - this.perspective
    }" y2="${this.h}" stroke="blue" stroke-width="1"/>`;
    this.sDelete += `<line x1="${this.width}" y1="${this.height}" x2="${
      this.width - this.perspective
    }" y2="${this.h}" stroke="white" stroke-width="1"/>`;

    return s;
  }
}