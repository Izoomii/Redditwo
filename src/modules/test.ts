import { Router } from "express";
import multer from "multer";

const testRouter = Router();

const upload = multer();

testRouter.post("/post/lookback", upload.none(), (req, res) => {
  res.json(req.body);
});

export = testRouter;
