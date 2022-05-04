import { Comment, Post, User, VoteType } from "@prisma/client";
import { Router } from "express";
import { uploadSingle } from "../libs/middleware/uploadImage";
import { isAuthentified } from "../libs/middleware/auth";
import prisma from "../libs/prisma";
import { postImagesDestination } from "../libs/globalVars";

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
  console.log(`Fetched post [id: ${post.id}]`);
  res.json({ post: post });
});

//this feels janky, IMPL
postRouter.get("/:id/votecount", async (req, res) => {
  const postId = req.params.id;
  const user = req.user as User;
  const upvotes = await prisma.interaction.aggregate({
    where: {
      postId: postId,
      voteType: "UP",
    },
    _count: true,
  });
  const downvotes = await prisma.interaction.aggregate({
    where: {
      postId: postId,
      voteType: "DOWN",
    },
    _count: true,
  });
  if (user) {
    const vote = await prisma.interaction.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });
    //CHNL repeated code.
    if (vote) {
      res.json({
        upvotes: upvotes._count,
        downvotes: downvotes._count,
        total: upvotes._count - downvotes._count,
        votetype: vote.voteType,
      });
    } else {
      res.json({
        upvotes: upvotes._count,
        downvotes: downvotes._count,
        total: upvotes._count - downvotes._count,
      });
    }
  } else {
    res.json({
      upvotes: upvotes._count,
      downvotes: downvotes._count,
      total: upvotes._count - downvotes._count,
    });
  }
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
  const postVote = await prisma.interaction.findUnique({
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
      const result = await prisma.interaction.update({
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
      const result = await prisma.interaction.update({
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
    const newVote = await prisma.interaction.create({
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

postRouter.get("/:id/save", async (req, res) => {
  const postId = req.params.id;
  const user = req.user as User;
  if (!user) {
    res.json({ saved: false });
  } else {
    const interaction = await prisma.interaction.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });
    if (interaction) {
      res.json({ saved: interaction.saved });
    } else {
      res.json({ saved: false });
    }
  }
});

postRouter.post("/:id/save", isAuthentified, async (req, res) => {
  const postId = req.params.id;
  const user = req.user as User;
  const findPost = await prisma.post.findUnique({ where: { id: postId } });
  if (!findPost) return res.json({ message: "Post doesn't exit" });
  const existingSave = await prisma.interaction.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: postId,
      },
    },
  });
  if (existingSave) {
    const newSave = await prisma.interaction.update({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
      data: {
        saved: !existingSave.saved,
      },
    });
    res.json({ message: `Updated interaction with save ${newSave.saved}` });
  } else {
    await prisma.interaction.create({
      data: {
        userId: user.id,
        postId: postId,
        voteType: null,
        saved: true,
      },
    });
    res.json({ message: `Created new interaction instance with save: TRUE` });
  }
});

//creates a new post for a user
postRouter.post(
  "/createpost",
  isAuthentified,
  uploadSingle("image", postImagesDestination),
  async (req, res) => {
    const body = req.body as Post;
    const user = req.user as User;
    const images = req.file ? [req.file.filename] : [];
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
        images: images,
      },
    });
    await prisma.interaction.create({
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
  }
);

postRouter.post(
  "/updatepost/:id",
  isAuthentified,
  uploadSingle("image", postImagesDestination),
  async (req, res) => {
    const postId = req.params.id;
    const body = req.body as Post;
    const image = req.file;
    const user = req.user as User;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) return res.json({ message: "Post doesn't exist" });
    if (user.nickname !== post.authorName)
      return res.json({ message: "Not author of the post" });
    if (body.title === "")
      return res.json({ message: "Title cannot be empty" });

    const updatedPost = image
      ? await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            title: body.title,
            content: body.content,
            images: [image.filename],
          },
        })
      : await prisma.post.update({
          where: {
            id: post.id,
          },
          data: {
            title: body.title,
            content: body.content,
          },
        });

    res.json({ message: "Updated post" });
  }
);

postRouter.get("/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const comments = await prisma.comment.findMany({
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      postId: postId,
    },
  });
  res.json(comments);
});

postRouter.post("/:postId/comment", isAuthentified, async (req, res) => {
  const user = req.user as User;
  const body = req.body as Comment;
  const postId = req.params.postId;
  const existingPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!existingPost) return res.json({ message: "Post doesn't exist" });
  if (body.content === "") return res.json({ message: "Comment is empty" });
  const newComment = await prisma.comment.create({
    data: {
      ownerName: user.nickname,
      postId: postId,
      content: body.content,
    },
  });
  res.json(newComment);
});

postRouter.post(
  "/:commentId/updatecomment",
  isAuthentified,
  async (req, res) => {
    const commentId = req.params.commentId;
    const body = req.body as Comment;

    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!existingComment) return res.json({ message: "Comment doesn't exist" });
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: body.content,
      },
    });
    res.json(updatedComment);
  }
);

export = postRouter;
