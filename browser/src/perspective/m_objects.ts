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

    aCircles: { x: number, y: number, r: number, curx: number, cury: number, curr:number }[] = [];
    mMe: M_Me = M_Me.getInstance();
    mScene = M_Scene.getInstance();
    sDelete = "";

    constructor() {

        let mCircle1 = { x: 5, y: 30, r: 1, curx: 5, cury: 30, curr: 1 };
        this.aCircles.push(mCircle1);

        let mCircle2 = { x: 25, y: 60, r: 1, curx: 25, cury: 60, curr: 1 };
        this.aCircles.push(mCircle2);


    }

    // create svg images for circles
    createSvg() {
        let s = "";
        this.sDelete = "";


        for (let i = 0; i < this.aCircles.length; i++) {
            let mCircle = this.aCircles[i];
            s += `<circle cx="${mCircle.curx}" cy="${mCircle.cury}" r="${mCircle.curr}" fill="red"/>`;
            this.sDelete += `<circle cx="${mCircle.curx}" cy="${mCircle.cury}" r="${mCircle.curr}" fill="white" stroke="white" stroke-width="3" />`;
        }


        return s;
    }



    // recalculate x, y positions for circles according my position
    recalculate() {
        // calculate distance between me and circles
        // scene height is 100m, scene width is 30m, circle y is 30m, me y is 0m, me x means 15m, circle x is 5m, at what pixel should the circle be drawn?
        // scene height - (scene height * circle y / 100) + me y
        // 0 + (scene width * circle x / 30) + me x

        // calulate distance between me and circles
        // if distance is 0, draw 1m radius of circle
        // scene hight * circle r / 100
        // if distance is 600px, draw 0.5m radius of circle
        // scene hight * circle r / 200
        
        let distance: number = 0.0;
        let distance0r: number = 0.0;
        let distance600r: number = 0.0;
        let delta: number = 0.0;





        for (let i = 0; i < this.aCircles.length; i++) {



            this.aCircles[i].curx = this.mScene.width * this.aCircles[i].x / 30;
            this.aCircles[i].cury =  this.mScene.height - (this.mScene.height*this.aCircles[i].y/100) + this.mMe.y + this.mMe.pressedy;
            distance = Math.sqrt(
              (this.aCircles[i].curx - (this.mMe.x + this.mScene.width / 2)) *
                (this.aCircles[i].curx - (this.mMe.x + this.mScene.width / 2)) +
                (this.aCircles[i].cury - this.mMe.y) *
                  (this.aCircles[i].cury - this.mMe.y)
            );

            distance0r = this.mScene.width * this.aCircles[i].r / 30;
            distance600r = this.mScene.width * this.aCircles[i].r / 60;
            delta = (distance600r - distance0r)*distance/600;



            this.aCircles[i].curr = distance0r - delta;



        }
    }





}