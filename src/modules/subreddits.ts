import { Router } from "express";
import { Post, Sub, User } from "@prisma/client";
import prisma from "../libs/prisma";
import { isAuthentified } from "../libs/middleware/auth";

const subredditRouter = Router();

subredditRouter.get("/", async (_, res) => {
  //console.log(req.session);
  const results = await prisma.sub.findMany({
    select: {
      name: true,
    },
  });
  res.json(results);
});

subredditRouter.get("/:subName", async (req, res) => {
  const subName = req.params.subName;
  const sub = await prisma.sub.findUnique({
    where: {
      name: subName,
    },
    include: {
      posts: true,
    },
  });
  console.log(`Fetched r/${subName}`);
  res.json(sub);
});

//create new sub
subredditRouter.post("/createsub", isAuthentified, async (req, res) => {
  const sub = req.body as Sub;
  const user = req.user as User;
  const existingSub = await prisma.sub.findUnique({
    where: {
      name: sub.name,
    },
  });
  if (existingSub) return res.json({ message: "Sub already exists!" });
  const newSub = await prisma.sub.create({
    data: {
      name: sub.name,
      ownerName: user.nickname,
    },
  });
  res.json({
    message: `Created sub: [${newSub.name}], owned by ${user.nickname}`,
  });
});

export = subredditRouter;
