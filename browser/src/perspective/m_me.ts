export class M_Me {

    // singleton
    private static instance: M_Me;
    static getInstance() {
        if (!M_Me.instance) {
            M_Me.instance = new M_Me();
        }
        return M_Me.instance;
    }

    x: number = 0;
    y: number = 0;

    constructor() {
    }

    pressedx: number = 0;
    pressedy: number = 0;

    transform(x: number, y: number): { x: number; y: number } {
        return {
            x: x,
            y: y - (this.y + this.pressedy),
        };
    }


}