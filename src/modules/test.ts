import { Router } from "express";
import { uploadSingle } from "../libs/middleware/uploadImage";
import { avatarsDestination } from "../libs/globalVars";
import fs from "fs";

const testRouter = Router();

testRouter.post(
  "/post/lookback",
  uploadSingle("image", __dirname + "/imgTestFolder"),
  (req, res) => {
    const image = req.file;
    res.json({ message: `uploaded ${image.filename}` });
    console.log(__dirname);

    setTimeout(() => {
      fs.unlinkSync(__dirname + "/imgTestFolder/" + image.filename);
    }, 10000);
  }
);

export = testRouter;
