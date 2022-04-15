import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import prisma from "../libs/prisma";

const searchRouter = Router();

// interface searchQuery {
//   query: string;
// }

searchRouter.get("/", async (req, res) => {
  const query = req.query.query as string;
  const results = await prisma.post.findMany({
    where: {
      OR: [{ title: { contains: query } }, { content: { contains: query } }],
    },
  });
  console.log("Got search request, sending back response");
  res.json(results);
});

export = searchRouter;
