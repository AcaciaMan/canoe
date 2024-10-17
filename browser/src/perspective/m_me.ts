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

    // recreate svg images in resources folder 4 times in a second
    // move the me object down the screen 300 pixels in 120 seconds
    move() {

    for (let i = 0; i < 120*4; i++) {
        setInterval(() => {

            this.y = 300*i/(120*4);

        }, 250);
    }
}
}