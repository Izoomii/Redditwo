import { Router } from "express";
const testRouter = Router();

import multer from "multer";
const destination = __dirname + "/testUploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, "uploaded " + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("imagetest");

testRouter.post("/post/image", upload, async (req, res) => {
  upload(req, res, (err) => {
    if (err) console.log(err);
  });
  res.json({ message: "Image uploaded?", uploadFolder: destination });
});

testRouter.post("/post/lookback", (req, res) => {
  res.json(req.body);
});

export = testRouter;
