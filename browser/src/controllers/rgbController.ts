// return the rgb array

import { Request, Response } from "express";
import { M_PngToHsl } from "../util/m_png_to_hsl";
const path = require("path");

const getRGB = async (req: Request, res: Response) => {
  const pngPath = path.join(
    __dirname,
    "../../public",
    "resources",
    "water.png"
  );
  const mPngToHsl = new M_PngToHsl();
  const rgbPoints = await mPngToHsl.convertPngToRgb(pngPath);
  res.json(rgbPoints);
};

export default { getRGB };
