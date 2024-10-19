import { M_CalcPosition } from "./m_calc_position";

export class M_Draw {
    constructor() {
    }
    // create svg image in resources folder to draw a line 
    createSvg(x: number, y: number, color: string, d: number) {
        return {s: "", sDelete: ""};
    }
}

export class M_Draw_Top extends M_Draw {
    constructor() {
        super();
    }

    createSvg(x: number, y: number, color: string, d: number) {
        let s = "";
        let sDelete = "";
        // draw a circle radius 2 pixels
        s += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" />`;
        sDelete += `<circle cx="${x}" cy="${y}" r="4" stroke="white" stroke-width="2" fill="white" />`;
        return {s : s, sDelete : sDelete};
    }


}

export class M_Draw_Boat extends M_Draw {
  mH: number = 2;
  mW: number = 0.15;
  mWater: number = 0.3;
  mCalcPosition: M_CalcPosition = new M_CalcPosition();

  constructor() {
    super();
  }

  createSvg(x: number, y: number, color: string, d: number) {
    let s = "";
    let sDelete = "";
    // draw a stick length 30 pixels, width 5 pixels and gradient color
    const height = this.mCalcPosition.calcHeight(d, this.mH);
    const width = this.mCalcPosition.calcHeight(d, this.mW);
    const water = this.mCalcPosition.calcHeight(d, this.mWater);

    s += `<rect x="${x + water}" y="${y}" width="${width}" height="${height}" fill="${color}" />`;
    sDelete += `<rect x="${x + water}" y="${y}" width="${width}" height="${height}" fill="white" stroke="white" stroke-width="2" />`;

    return { s: s, sDelete: sDelete };
  }
}