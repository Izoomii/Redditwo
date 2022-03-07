import { Router } from "express";
import prisma from "../libs/prisma";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const results = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  console.log(results);
  res.json(results);
});

postRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id), //should change this if IDs are going to become random string sequence
    },
  });
  if (!post) {
    console.log("Get request with invalid id.");
    res.json({ message: "No post with that id." });
  } else {
    console.log("Sent res to get request of a redditwo post");
    res.json({ post: post });
  }
});

export = postRouter;
