import { Request, Response } from "express";
import { M_Scene } from "../perspective/m_scene";
import { M_Util } from "../util/m_util";
import { M_Me } from "../perspective/m_me";
import { M_Objects } from "../perspective/m_objects";
import { M_Executor, M_Executor_Boat, M_Executor_Top } from "../execute/m_executor";

const mUtil: M_Util = new M_Util();
const mMe: M_Me = M_Me.getInstance();
const mObjects = M_Objects.getInstance();
const mExecutorTop: M_Executor = M_Executor_Top.getInstance();
const mExecutorBoat: M_Executor = M_Executor_Boat.getInstance();
const mCamera = mExecutorTop.mCamera;


const getSVG1 = (req: Request, res: Response) => {

    let s = ""; 
    // if request is for parameter class === "gates5", draw mExecutorTop
    if (req.query.class === "gates5") {
        s = `<svg width="${mCamera.width}" height="${mCamera.height}" xmlns="http://www.w3.org/2000/svg">`;

        s += mExecutorTop.sDelete;
        mExecutorTop.calcPosition();
        s += mExecutorTop.draw();
        s += `</svg>`;
    } else if (req.query.class === "gates5boat") {

        // if request is for parameter class === "gates5boat", draw mExecutorTop
        s = `<svg width="${mCamera.width}" height="${mCamera.height}" xmlns="http://www.w3.org/2000/svg">`;

        s += mExecutorBoat.sDelete;
        mExecutorBoat.calcPosition();
        s += mExecutorBoat.draw();
        s += `</svg>`;
    } else   
    
    {




    mObjects.recalculate();
    s = `<svg width="1000" height="600" xmlns="http://www.w3.org/2000/svg">`;
    s += mObjects.sDelete;
    s += mObjects.createSvg();
  s += `</svg>`; };
  res.type("image/svg+xml").send(s);

};


export default { getSVG1 };
