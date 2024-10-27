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
  console.log(pngPath);

        let dataT = Buffer.from([]);
        console.log("loading image", dataT.length);
        await mTrend.load_image(pngPath)
        console.log("loaded image", dataT.length);
        dataT = mTrend.m_trend();
        console.log("loaded image", dataT.length);


  // respond with binary data
  res.send(dataT);     
};

export default { getTrend };
