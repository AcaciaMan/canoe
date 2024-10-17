// return the hsl array

import { Request, Response } from "express";
import { M_PngToHsl } from "../util/m_png_to_hsl";
const path = require('path');


const getHSL = async (req: Request, res: Response) => {
    
    const pngPath =  path.join(__dirname, "../../public", "resources", "water.png");;
    const mPngToHsl = new M_PngToHsl();
    const hslPoints = await mPngToHsl.convertPngToHsl(pngPath);
    res.json(hslPoints);
};

export default { getHSL };
