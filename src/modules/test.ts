import { Router } from "express";

const testRouter = Router();

testRouter.get("/get", async (req, res) => {
  console.log("got a get request in test page");
  console.log(req.query);
  //   res.send(req.session);
});

testRouter.get("/get/whatever", async (req, res) => {
  res.json(req.query);
});

testRouter.post("/post", async (req, res) => {
  const result = req.body;
  res.json({ thing: result });
});

export = testRouter;
