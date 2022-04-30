import { Router } from "express";
import multer from "multer";
import { uploadSingle } from "../libs/middleware/uploadImage";
import { avatarsDestination } from "../libs/globalVars";

const testRouter = Router();

const upload = multer();

testRouter.post("/post/lookback", upload.none(), (req, res) => {
  res.status(500).json(req.body);
});

export = testRouter;
