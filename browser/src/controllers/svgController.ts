import { Request, Response } from "express";
import { M_Scene } from "../perspective/m_scene";
import { M_Util } from "../util/m_util";
import { M_Me } from "../perspective/m_me";
import { M_Objects } from "../perspective/m_objects";
import { M_Executor, M_Executor_Boat, M_Executor_Top } from "../execute/m_executor";

const mScene: M_Scene = M_Scene.getInstance();
const mUtil: M_Util = new M_Util();
const mMe: M_Me = M_Me.getInstance();
const mObjects = M_Objects.getInstance();
const mExecutorTop: M_Executor = M_Executor_Top.getInstance();
const mExecutorBoat: M_Executor = M_Executor_Boat.getInstance();

const getSVG1 = (req: Request, res: Response) => {

    let s = ""; 
    // if request is for parameter class === "gates5", draw mExecutorTop
    if (req.query.class === "gates5") {
        s = `<svg width="${mScene.width}" height="${mScene.height}" xmlns="http://www.w3.org/2000/svg">`;
        s += mScene.sDelete;

        s += mExecutorTop.sDelete;
        mExecutorTop.calcPosition();
        s += mScene.createSvg();
        s += mExecutorTop.draw();
        s += `</svg>`;
    } else if (req.query.class === "gates5boat") {

        // if request is for parameter class === "gates5boat", draw mExecutorTop
        s = `<svg width="${mScene.width}" height="${mScene.height}" xmlns="http://www.w3.org/2000/svg">`;
        s += mScene.sDelete;

        s += mExecutorBoat.sDelete;
        mExecutorBoat.calcPosition();
        s += mScene.createSvg();
        s += mExecutorBoat.draw();
        s += `</svg>`;
    } else   
    
    {




    mObjects.recalculate();
    s = `<svg width="${mScene.width}" height="${mScene.height}" xmlns="http://www.w3.org/2000/svg">`;
    s += mScene.sDelete;
    s += mObjects.sDelete;
  s += mScene.createSvg();
    s += mObjects.createSvg();
  s += `</svg>`; };
  res.type("image/svg+xml").send(s);

};


export default { getSVG1 };
