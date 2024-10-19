import { M_Gates5 } from "../perspective/m_gates5";
import { M_CalcPosition } from "./m_calc_position";

export class M_Executor {
    // singleton
    private static instance: M_Executor;
    static getInstance() {
        if (!M_Executor.instance) {
            M_Executor.instance = new M_Executor();
        }
        return M_Executor.instance;
    }

    mGates5: M_Gates5 = new M_Gates5();
    mCalcPosition: M_CalcPosition = new M_CalcPosition();


    constructor() {
    }

}