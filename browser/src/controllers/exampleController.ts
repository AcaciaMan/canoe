import { Request, Response } from "express";
import { M_Scene } from "../perspective/m_scene";
import { M_Util } from "../util/m_util";

const getExample = (req: Request, res: Response) => {

  // create svg image in resources folder to draw a line 
  const mScene: M_Scene = new M_Scene();
    const s = mScene.createSvg();
    const mUtil: M_Util = new M_Util();
    mUtil.createSvgFile(s, "scene.svg");


  res.json({ message: "Hello from the server!" });
};

export default { getExample };
