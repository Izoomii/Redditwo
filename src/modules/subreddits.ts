import { Router } from "express";
import { User } from "@prisma/client";
import prisma from "../libs/prisma";

const subredditRouter = Router();

interface searchWords {
  words: string;
}

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

//replaced by the one up

// subredditRouter.get(`/r/:subreddit`, async (req, res) => {
//   const sub = req.params.subreddit;
//   const allSubPosts = await prisma.post.findMany({
//     where: {
//       sub: sub,
//     },
//   });
//   res.json(allSubPosts);
//   console.log(`Searched all posts in ${sub} subreddit`);
// });

//searches all posts in database for a specific keyword(s)
//doesnt work anymore? "words" is undefined when console logging it
subredditRouter.post("/searchposts", async (req, res) => {
  const keyWord = req.body as searchWords;
  //probably this has an empty req.body too
  console.log(keyWord.words);
  const results = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: keyWord.words } },
        { content: { contains: keyWord.words } },
      ],
    },
  });
  console.log(results);
  res.json({ results });
});

//creates a new post for a user
subredditRouter.post("/createpost", async (req, res) => {
  const body = req.body as any;
  const user = req.user as User;

  if (!user) {
    console.log("Invalid user");
    res.json({ message: "Invalid user" });
  } else {
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
  }
});

export = subredditRouter;
