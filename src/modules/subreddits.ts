import { Router } from "express";
import { Post } from "@prisma/client";

import prisma from "../libs/prisma";

const subredditRouter = Router();

interface searchWords {
  words: string;
}

subredditRouter.get("/main", async (req, res) => {
  //console.log(req.session);
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(posts);
  let cookie = getcookie(req);
  if (cookie == undefined) {
    console.log("No cookie created yet.");
  } else {
    console.log(cookie);
  }
});

function getcookie(req: any) {
  try {
    var cookie = req.headers.cookie;
    // user=someone; session=QyhYzXhkTZawIb5qSl3KKyPVN (this is my cookie i get)
    console.log("Cookie:");
    return cookie.split("; ");
  } catch {
    console.log("Error fetching cookie from header.");
  }
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
  const body = req.body as Post;

  const user = await prisma.user.findUnique({
    where: {
      nickname: body.authorName,
    },
  });

  if (!user) {
    console.log("Invalid user");
    res.json({ message: "Invalid user" });
  } else {
    // console.log("Post gets created here.");
    await prisma.post.create({
      data: {
        sub: body.sub,
        title: body.title,
        content: body.content,
        authorName: body.authorName,
      },
    });
    res.json({
      message: `Post created! Title: ${body.title}, made by ${body.authorName}`,
    });
  }
  // console.log(`Post created in sub ${body.sub} with title "${body.title}"`);
});

export = subredditRouter;
