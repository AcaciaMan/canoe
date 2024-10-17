import { Request, Response } from "express";

const getExample = (req: Request, res: Response) => {
  res.json({ message: "Hello from the server!" });
};

export default { getExample };
