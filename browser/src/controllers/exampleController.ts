import { Request, Response } from "express";
import { M_Scene } from "../perspective/m_scene";
import { M_Util } from "../util/m_util";
import { M_Me } from "../perspective/m_me";
import { M_Objects } from "../perspective/m_objects";


const getExample = (req: Request, res: Response) => {






  res.json({ message: "Hello from the server!" });
};


export default { getExample };
