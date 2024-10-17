import { Request, Response } from "express";
import { M_Me } from "../perspective/m_me";

const mMe = M_Me.getInstance();

let mPressedTAt = 0;
let mPressedGAt = 0;

const handleKeyEvent = (req: Request, res: Response) => {
  const { event, key, pressedAt, releasedAt } = req.body;


  if (event === "keydown" && key === "t") {
    mPressedTAt = pressedAt;
  }

    if (event === "keydown" && key === "g") {
        mPressedGAt = pressedAt;
    }

  if (event === "keyup" && key === "t") {
    // move me object down the screen 300 pixels in 60 seconds
    const mTime = releasedAt - pressedAt;
    mPressedTAt = 0;
    mMe.pressedy = 0;
    mMe.y += (600 * mTime) / 10000;


    }

  if (event === "keyup" && key === "g") {
    // move me object down the screen 300 pixels in 120 seconds
    const mTime = releasedAt - pressedAt;
    mPressedGAt = 0;
    mMe.pressedy = 0;
    mMe.y -= (600 * mTime) / 10000;
  }


  res.json({ message: "Key event received" });
};

setInterval(() => {
    let mTime = 0;
    if (mPressedTAt > 0) {
        mTime = Date.now() - mPressedTAt;
        mMe.pressedy = (600 * mTime) / 10000;
    }
    
    if (mPressedGAt > 0) {
        mTime = Date.now() - mPressedGAt;

        mMe.pressedy = -(600 * mTime) / 10000;
    }
    }, 250);

export default { handleKeyEvent };
