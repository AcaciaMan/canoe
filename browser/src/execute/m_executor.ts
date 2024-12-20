import keyEventController from "../controllers/keyEventController";
import { M_Camera, M_Camera_Boat, M_Camera_Top } from "../perspective/m_camera";
import { M_Gates5 } from "../perspective/m_gates5";
import { M_Me } from "../perspective/m_me";
import { M_CalcPosition } from "./m_calc_position";
import { M_Draw, M_Draw_Boat, M_Draw_Top } from "./m_draw";

export class M_Executor {
    // singleton
    static instance: M_Executor;
    static getInstance() {
        if (!M_Executor.instance) {
            M_Executor.instance = new M_Executor();
        }
        return M_Executor.instance;
    }

    mGates5: M_Gates5 = new M_Gates5();
    mCalcPosition: M_CalcPosition = new M_CalcPosition();
    s = "";
    sDelete = "";
    mDraw: M_Draw = new M_Draw();
    mCamera: M_Camera = M_Camera.getInstance();
    mMe: M_Me = M_Me.getInstance();

    constructor() {
    }

    calcPosition() {

        keyEventController.checkControls();
        this.s = "";
        this.sDelete = "";

        // calculate scene position of gates
        for (let i = 0; i < this.mGates5.aSticks.length; i++) {
            let mGate = this.mGates5.aSticks[i];
            let mPosition = this.mMe.transform(mGate.x, mGate.y);
            mGate.scenex = mPosition.x;
            mGate.sceney = mPosition.y;
    }
    }

    draw() {
        
        for (let i = 0; i < this.mGates5.aSticks.length; i++) {
            let mGate = this.mGates5.aSticks[i];
            let svg = this.mDraw.createSvg(this.mCamera, mGate.scenex, mGate.sceney, mGate.color, mGate.d);
            this.s += svg.s;
            this.sDelete += svg.sDelete;
        }
        return this.s;
    }


}

export class M_Executor_Top extends M_Executor {
    static topInstance: M_Executor_Top;

    static getInstance() {
        if (!M_Executor_Top.topInstance) {
          M_Executor_Top.topInstance = new M_Executor_Top();
        }
        return M_Executor_Top.topInstance;
    }


    constructor() {
        super();
        this.mDraw = new M_Draw_Top();
        this.mCamera = M_Camera_Top.getInstance();
    }

    draw () {
              let svg = this.mDraw.drawBorder();
              this.s += svg.s;
              this.sDelete += svg.sDelete;

              super.draw();

                return this.s;
    
    }


}

export class M_Executor_Boat extends M_Executor {
    static boatInstance: M_Executor_Boat;
   
        static getInstance() {
            if (!M_Executor_Boat.boatInstance) {
              M_Executor_Boat.boatInstance = new M_Executor_Boat();
            }
            return M_Executor_Boat.boatInstance;
        }

        constructor() {
            super();
            this.mDraw = new M_Draw_Boat();
            this.mCamera = M_Camera_Boat.getInstance();
        }

        calcPosition() {
            super.calcPosition();
            // calculate distance between me and gates
            for (let i = 0; i < this.mGates5.aSticks.length; i++) {
                let mGate = this.mGates5.aSticks[i];
                mGate.d = this.mCalcPosition.calcDistance(mGate.scenex, mGate.sceney);
            }

            // sort gates by distance in descending order
            this.mGates5.aSticks.sort((a, b) => b.d - a.d);


        }

    }