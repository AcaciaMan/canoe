// return the rgb array

import { Request, Response } from "express";

import path from "path";
import { M_Trend } from "../util/m_trend";
      const mTrend: M_Trend = M_Trend.getInstance();
const getTrend = async (req: Request, res: Response) => {
  const pngPath = path.join(
    __dirname,
    "../../public",
    "resources",
    "gates.png"
  );
        let dataT = Buffer.from([]);
        await mTrend.load_image(pngPath)
        dataT = await mTrend.m_trend();


  // respond with binary data
  res.send(dataT);     
};

export default { getTrend };
