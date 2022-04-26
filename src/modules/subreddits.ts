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

subredditRouter.get("/subscribe/:subId", async (req, res) => {
  const user = req.user as User;
  if (!user) return res.json({ subscribed: false });
  const subId = req.params.subId;
  const checkSubscription = await prisma.subscription.findUnique({
    where: {
      userId_subId: {
        userId: user.id,
        subId: subId,
      },
    },
  });
  if (!checkSubscription)
    return res.json({
      message: `${user.nickname} doesn't have any subscription records with this sub yet`,
      subscribed: false,
    });
  if (checkSubscription.subscribed === true) {
    return res.json({ subscribed: true });
  } else {
    return res.json({ subscribed: false });
  }
});

subredditRouter.post(`/subscribe/:subId`, isAuthentified, async (req, res) => {
  const user = req.user as User;
  const subId = req.params.subId;
  const checkSub = await prisma.sub.findUnique({
    where: {
      id: subId,
    },
  });
  if (!checkSub) return res.json({ message: "Sub doesn't exist" });
  const checkSubscription = await prisma.subscription.findUnique({
    where: {
      userId_subId: {
        userId: user.id,
        subId: subId,
      },
    },
  });
  if (checkSubscription) {
    //update subscription here
    const updatedSubscription = await prisma.subscription.update({
      where: {
        userId_subId: {
          userId: user.id,
          subId: subId,
        },
      },
      data: {
        subscribed: !checkSubscription.subscribed,
      },
    });
    res.json({
      message: `[${updatedSubscription.subscribed}] Updated ${user.nickname} Subscription to ${checkSub.name}`,
    });
  } else {
    const newSubscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        subId: subId,
        subscribed: true,
      },
    });
    res.json({
      message: `${user.nickname} is now subscribed to ${checkSub.name}`,
    });
  }
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
