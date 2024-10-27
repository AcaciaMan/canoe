// return the rgb array

import { Request, Response } from "express";

import path from "path";
import { M_Trend } from "../util/m_trend";
import { M_TrendWide } from "../util/m_trend_wide";
      let mTrend: M_Trend = M_Trend.getInstance();
const getTrend = async (req: Request, res: Response) => {

  if (req.query.class === "randomize") {
    mTrend = M_Trend.getInstance();
  } else if (req.query.class === "wide") {
    mTrend = M_TrendWide.getInstance();
  }
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

}

export default { getTrend };
