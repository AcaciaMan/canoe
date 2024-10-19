import { M_Gates5 } from "../perspective/m_gates5";
import { M_CalcPosition } from "./m_calc_position";
import { M_Draw, M_Draw_Top } from "./m_draw";

export class M_Executor {
    // singleton
    protected static instance: M_Executor;
    static getInstance() {
        if (!M_Executor.instance) {
            M_Executor.instance = new M_Executor();
        }
        return M_Executor.instance;
    }

    mGates5: M_Gates5 = new M_Gates5();
    mCalcPosition: M_CalcPosition = new M_CalcPosition();
    sDelete = "";
    mDraw: M_Draw = new M_Draw();

    constructor() {
    }

    calcPosition() {

        // calculate scene position of gates
        for (let i = 0; i < this.mGates5.aSticks.length; i++) {
            let mGate = this.mGates5.aSticks[i];
            let mPosition = this.mCalcPosition.calcPosition(mGate.x, mGate.y);
            mGate.scenex = mPosition.x;
            mGate.sceney = mPosition.y;
    }
    }

    deletePrevious() {
      return this.sDelete;
    }

    draw() {
        let s = "";
        this.sDelete = "";
        for (let i = 0; i < this.mGates5.aSticks.length; i++) {
            let mGate = this.mGates5.aSticks[i];
            let svg = this.mDraw.createSvg(mGate.scenex, mGate.sceney, mGate.color);
            s += svg.s;
            this.sDelete += svg.sDelete;
        }
        return s;
    }


}

export class M_Executor_Top extends M_Executor {
    

    static getInstance() {
        if (!M_Executor_Top.instance) {
            M_Executor_Top.instance = new M_Executor_Top();
        }
        return M_Executor_Top.instance;
    }


    constructor() {
        super();
        this.mDraw = new M_Draw_Top();
    }


}