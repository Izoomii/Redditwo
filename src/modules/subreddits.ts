import { Router } from "express";
import { PrismaClient, Post, User } from "@prisma/client";

const prisma = new PrismaClient();

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
  if (!req.user) {
    res.send("Please connect first to be able to make posts");
    console.log("Cannot create a post without being logged in");
  } else {
    let connectedUser = req.user as User;
    await prisma.post.create({
      data: {
        sub: body.sub,
        title: body.title,
        content: body.content,
        authorName: connectedUser.nickname,
      },
    });
    res.send(`Post created in ${body.sub}!\n Title: ${body.title}`);
    console.log(`Post created in sub ${body.sub} with title "${body.title}"`);
  }
});

export = subredditRouter;
