export class M_Me {

    // singleton
    private static instance: M_Me;
    static getInstance() {
        if (!M_Me.instance) {
            M_Me.instance = new M_Me();
        }
        return M_Me.instance;
    }

    z: number = 1;
    // what is type for x, y position?
    x: number = 0;
    y: number = 0;

    constructor() {
    }

    pressedx: number = 0;
    pressedy: number = 0;


}