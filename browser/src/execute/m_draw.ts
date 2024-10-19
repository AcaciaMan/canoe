export class M_Draw {
    constructor() {
    }
    // create svg image in resources folder to draw a line 
    createSvg(x: number, y: number, color: string) {
        return {s: "", sDelete: ""};
    }
}

export class M_Draw_Top extends M_Draw {
    constructor() {
        super();
    }

    createSvg(x: number, y: number, color: string) {
        let s = "";
        let sDelete = "";
        // draw a circle radius 2 pixels
        s += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" />`;
        sDelete += `<circle cx="${x}" cy="${y}" r="4" stroke="white" stroke-width="2" fill="white" />`;
        return {s : s, sDelete : sDelete};
    }


}