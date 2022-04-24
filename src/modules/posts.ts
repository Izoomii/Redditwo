import { Post, User, VoteType } from "@prisma/client";
import { Router } from "express";
import { isAuthentified } from "../libs/middleware/auth";
import prisma from "../libs/prisma";

const postRouter = Router();

postRouter.get("/", async (_, res) => {
  const results = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  // console.log(results);
  res.json(results);
});

postRouter.get("/all", async (_, res) => {
  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(posts);
});

postRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) {
    console.log("Get request with invalid id.");
    return res.json({ message: "No post with that id." });
  }
  console.log(`Responded to GET request of a post [id: ${post.id}]`);
  res.json({ post: post });
});

//this feels janky, IMPL
postRouter.get("/:id/votecount", async (req, res) => {
  const id = req.params.id;
  const upvotes = await prisma.vote.aggregate({
    where: {
      postId: id,
      voteType: "UP",
    },
    _count: true,
  });
  const downvotes = await prisma.vote.aggregate({
    where: {
      postId: id,
      voteType: "DOWN",
    },
    _count: true,
  });
  res.json({
    upvotes: upvotes._count,
    downvotes: downvotes._count,
    total: upvotes._count - downvotes._count,
  });
});

//IMPL this feels like it can be improved a lot more
postRouter.post("/:id/vote", isAuthentified, async (req, res) => {
  const id = req.params.id;
  const user = req.user as User;
  const vote = req.body.vote as VoteType;
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  if (!post) return res.json({ message: "Post doesn't exist." });
  const postVote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: id,
      },
    },
  });
  if (postVote) {
    //change vote type here..
    if (postVote.voteType === vote) {
      const result = await prisma.vote.update({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
        data: {
          voteType: null,
        },
      });
      res.json({
        message: `[UPDATE]: ${result.voteType}voted post: [${post.id}]`,
        vote: result.voteType,
      });
    } else {
      const result = await prisma.vote.update({
        where: {
          userId_postId: {
            userId: user.id,
            postId: id,
          },
        },
        data: {
          voteType: vote,
        },
      });
      res.json({
        message: `[UPDATE]: ${result.voteType}voted post: [${post.id}]`,
        vote: result.voteType,
      });
    }
  } else {
    const newVote = await prisma.vote.create({
      data: {
        userId: user.id,
        postId: post.id,
        voteType: vote,
      },
    });
    res.json({
      message: `[CREATE]: ${vote}voted post: [${post.id}]`,
      vote: newVote.voteType,
    });
  }
});

//creates a new post for a user
postRouter.post("/createpost", isAuthentified, async (req, res) => {
  const body = req.body as Post;
  const user = req.user as User;
  // console.log("Post gets created here.", user);
  const sub = await prisma.sub.findUnique({
    where: {
      name: body.subName,
    },
  });
  if (!sub) return res.json({ message: "Sub doesn't exist" });
  const post = await prisma.post.create({
    data: {
      subName: body.subName,
      title: body.title,
      content: body.content,
      authorName: user.nickname,
    },
  });
  const newVote = await prisma.vote.create({
    data: {
      userId: user.id,
      postId: post.id,
      voteType: "UP",
    },
  });
  res.json({
    message: `Post created! Title: ${post.title}, made by ${user.nickname}`,
  });
  // console.log(`Post created in sub ${body.subName} with title "${body.title}"`);
});

export = postRouter;
