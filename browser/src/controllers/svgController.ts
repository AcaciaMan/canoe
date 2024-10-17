import { Request, Response } from "express";
import { M_Scene } from "../perspective/m_scene";
import { M_Util } from "../util/m_util";
import { M_Me } from "../perspective/m_me";
import { M_Objects } from "../perspective/m_objects";

const mScene: M_Scene = M_Scene.getInstance();
const mUtil: M_Util = new M_Util();
const mMe: M_Me = M_Me.getInstance();
const mObjects = M_Objects.getInstance();

const getSVG1 = (req: Request, res: Response) => {
    mObjects.recalculate();
    let s = `<svg width="${mScene.width}" height="${mScene.height}" xmlns="http://www.w3.org/2000/svg">`;
    s += mScene.sDelete;
    s += mObjects.sDelete;
  s += mScene.createSvg();
    s += mObjects.createSvg();
  s += `</svg>`;
  res.type("image/svg+xml").send(s);
};


export default { getSVG1 };
