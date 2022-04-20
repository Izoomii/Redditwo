import { Router } from "express";
import { Post, User } from "@prisma/client";
import prisma from "../libs/prisma";
import { isAuthentified } from "../libs/middleware/auth";

const subredditRouter = Router();

subredditRouter.get("/", async (_, res) => {
  //console.log(req.session);
  const results = await prisma.post.findMany({
    select: {
      sub: true,
    },
  });
  //filters and removes duplicates
  const subs = [
    ...new Set(
      results.map((e) => {
        return e.sub;
      })
    ),
  ];
  //just think it is better to send it the way it was fetched by prisma for the sake of consistency
  res.json(
    subs.map((e) => {
      return { sub: e };
    })
  );
});

subredditRouter.get("/:sub", async (req, res) => {
  const sub = req.params.sub;
  const results = await prisma.post.findMany({
    where: {
      sub: sub,
    },
  });
  console.log(`Searched for all posts in r/${sub}`);
  res.json(results);
});

//creates a new post for a user
subredditRouter.post("/createpost", isAuthentified, async (req, res) => {
  const body = req.body as Post;
  const user = req.user as User;
  // console.log("Post gets created here.", user);
  await prisma.post.create({
    data: {
      sub: body.sub,
      title: body.title,
      content: body.content,
      authorName: user.nickname,
    },
  });
  res.json({
    message: `Post created! Title: ${body.title}, made by ${user.nickname}`,
  });
  console.log(`Post created in sub ${body.sub} with title "${body.title}"`);
});

export = subredditRouter;
