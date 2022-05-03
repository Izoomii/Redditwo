import { User, Sub } from "@prisma/client";
import { Router } from "express";
import prisma from "../libs/prisma";

const mainRouter = Router();

mainRouter.get("/", async (req, res) => {
  const user = req.user as User;
  if (!user) return res.redirect("/posts/all");

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      sub: {
        subscriptions: {
          some: {
            userId: user.id,
            subscribed: true,
          },
        },
      },
    },
  });
  res.json(posts);
});

export = mainRouter;
