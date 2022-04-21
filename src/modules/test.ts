import { Router } from "express";
const testRouter = Router();

testRouter.post("/post/lookback", (req, res) => {
  res.json(req.body);
});

export = testRouter;
