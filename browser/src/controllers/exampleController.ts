import { Request, Response } from "express";
import { M_Scene } from "../perspective/m_scene";
import { M_Util } from "../util/m_util";
import { M_Me } from "../perspective/m_me";

  const mScene: M_Scene = M_Scene.getInstance();
      const mUtil: M_Util = new M_Util();
      const mMe: M_Me = M_Me.getInstance();


const getExample = (req: Request, res: Response) => {



  // create svg image in resources folder to draw a line 

    const s = mScene.createSvg();

    mUtil.createSvgFile(s, "scene.svg");


  res.json({ message: "Hello from the server!" });
};

export default { getExample };
