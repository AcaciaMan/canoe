import { M_Me } from "./m_me";
import { M_Scene } from "./m_scene";

export class M_Objects {

    // singleton
    private static instance: M_Objects;
    static getInstance() {
        if (!M_Objects.instance) {
            M_Objects.instance = new M_Objects();
        }
        return M_Objects.instance;
    }

    aCircles: { x: number, y: number, r: number, curx: number, cury: number }[] = [];
    mMe: M_Me = M_Me.getInstance();
    mScene = M_Scene.getInstance();
    sDelete = "";

    constructor() {

        let mCircle1 = { x: 5, y: 30, r: 3, curx: 5, cury: 30 };
        this.aCircles.push(mCircle1);

        let mCircle2 = { x: 25, y: 60, r: 3, curx: 25, cury: 60 };
        this.aCircles.push(mCircle2);


    }

    // create svg images for circles
    createSvg() {
        let s = "";
        this.sDelete = "";


        for (let i = 0; i < this.aCircles.length; i++) {
            let mCircle = this.aCircles[i];
            s += `<circle cx="${mCircle.curx}" cy="${mCircle.cury}" r="${mCircle.r}" fill="red"/>`;
            this.sDelete += `<circle cx="${mCircle.curx}" cy="${mCircle.cury}" r="${mCircle.r}" fill="white" stroke="white" stroke-width="3" />`;
        }


        return s;
    }



    // recalculate x, y positions for circles according my position
    recalculate() {
        for (let i = 0; i < this.aCircles.length; i++) {
            this.aCircles[i].cury =  this.mScene.height - this.aCircles[i].y + this.mMe.y + this.mMe.pressedy;
        }
    }





}