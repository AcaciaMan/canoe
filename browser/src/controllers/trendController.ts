// return the rgb array

import { Request, Response } from "express";
import { M_PngToHsl } from "../util/m_png_to_hsl";
import sharp from "sharp";
import path from "path";
import { M_Trend } from "../util/m_trend";

const getTrend = async (req: Request, res: Response) => {
  const pngPath = path.join(
    __dirname,
    "../../public",
    "resources",
    "gates.png"
  );
    const image = sharp(pngPath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

      const mTrend: M_Trend = M_Trend.getInstance();
        mTrend.load_image(pngPath);
        const dataT = mTrend.data;


  // respond with binary data
  res.send(dataT);     
};

export default { getTrend };
