import { Request, Response } from "express";

const handleKeyEvent = (req: Request, res: Response) => {
  const { event, key, pressedAt, releasedAt } = req.body;

  res.json({ message: "Key event received" });
};

export default { handleKeyEvent };
