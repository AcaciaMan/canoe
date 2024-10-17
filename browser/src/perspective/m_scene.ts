export class M_Scene {

    // constants for the scene - width and height
    width: number = 1000;
    height: number = 600;

    horizon: number = 20;

    depth: number = 100;

    perspective: number = 50;

    constructor() {
        
    }

    createSvg() {
        let s = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">`;

        // draw a line for the horizon
        const h = this.height*this.horizon/100;
        s += `<line x1="0" y1="${h}" x2="${this.width}" y2="${h}" stroke="black" stroke-width="1"/>`;

        // draw a line for the river
        s += `<line x1="0" y1="${this.height}" x2="${this.perspective}" y2="${h}" stroke="blue" stroke-width="1"/>`;
        s += `<line x1="${this.width}" y1="${this.height}" x2="${this.width-this.perspective}" y2="${h}" stroke="blue" stroke-width="1"/>`;


        s += `</svg>`;

        return s;
    }
}