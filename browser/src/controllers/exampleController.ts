import { Request, Response } from "express";
import { M_Scene } from "../perspective/m_scene";
import { M_Util } from "../util/m_util";
import { M_Me } from "../perspective/m_me";
import { M_Objects } from "../perspective/m_objects";

  const mScene: M_Scene = M_Scene.getInstance();
      const mUtil: M_Util = new M_Util();
      const mMe: M_Me = M_Me.getInstance();
      const mObjects = M_Objects.getInstance();


const getExample = (req: Request, res: Response) => {



  // create svg image in resources folder to draw a line 

    const s = mScene.createSvg();

    mUtil.createSvgFile(s, "scene.svg");
    


  res.json({ message: "Hello from the server!" });
};

const updateSvgImages = () => {
    mObjects.recalculate();
    mObjects.saveSvg();
    }

// Set up an interval to update SVG images every 250ms
setInterval(updateSvgImages, 250);

export default { getExample };
