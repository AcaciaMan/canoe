import { Request, Response } from "express";
import { M_Me } from "../perspective/m_me";

const mMe = M_Me.getInstance();

const handleKeyEvent = (req: Request, res: Response) => {
  const { event, key, pressedAt, releasedAt } = req.body;

  if (event === "keyup" && key === "t") {
    // move me object down the screen 300 pixels in 120 seconds
    const mTime = releasedAt - pressedAt;
    mMe.y += (300 * mTime) / 120000;


    }

  if (event === "keyup" && key === "g") {
    // move me object down the screen 300 pixels in 120 seconds
    const mTime = releasedAt - pressedAt;
    mMe.y -= (300 * mTime) / 120000;
  }


  res.json({ message: "Key event received" });
};

export default { handleKeyEvent };
