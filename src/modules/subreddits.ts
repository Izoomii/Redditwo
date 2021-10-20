import { Router } from "express";
import { PrismaClient, User, Post } from "@prisma/client";

const prisma = new PrismaClient();

const subredditRouter = Router();

interface searchWords {
  words: string;
}

//finds all posts of a subreddit
subredditRouter.get(`/r/:subreddit`, async (req, res) => {
  const sub = req.params.subreddit;
  const allSubPosts = await prisma.post.findMany({
    where: {
      sub: sub,
    },
  });
  res.json(allSubPosts);
  console.log(`Searched all posts in ${sub} subreddit`);
});

//searches all posts in database for a specific keyword(s)
//doesnt work anymore? "words" is undefined when console logging it
subredditRouter.get("/searchposts", async (req, res) => {
  const keyWord = req.body as searchWords;
  console.log(keyWord.words);
  const results = await prisma.post.findMany({
    where: {
      content: {
        contains: keyWord.words,
      },
    },
  });
  res.json(results);
});

//creates a new post for a user
subredditRouter.post("/createpost", async (req, res) => {
  const body = req.body as Post;
  await prisma.post.create({
    data: {
      sub: body.sub,
      title: body.title,
      content: body.content,
      authorName: body.authorName,
    },
  });
  res.send(`Post created in ${body.sub}!\n Title: ${body.title}`);
  console.log(`Post created in sub ${body.sub} with title "${body.title}"`);
});

export = subredditRouter;
