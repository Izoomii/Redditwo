import { Router } from "express";
import { User } from "@prisma/client";
import * as argonfuncs from "../modules/authfuncs";

import prisma from "../libs/prisma";

const userRouter = Router();

//finds all users registered
userRouter.get("/all", async (_, res) => {
  const users = await prisma.user.findMany({
    select: {
      nickname: true,
    },
  });
  res.json(users);
  console.log("Searched for all users");
});

//finds all posts of a user
userRouter.get(`/`, async (req, res) => {
  const user = req.query.user as string;
  if (user === undefined || user === "") {
    return res.status(404).send("No user defined");
  }
  const allUserPosts = await prisma.post.findMany({
    where: {
      authorName: user,
    },
  });
  res.json(allUserPosts);
  console.log(`Searched posts of user ${user}`);
  if (req.user) {
    let connectedUser = req.user as User;
    if (connectedUser.nickname == user) {
      console.log(connectedUser.nickname + " It's you!");
    }
  }
});

//program tries to search for posts of user "verifyme", change the func responsible if u wanna test this

// verifies a user's identity
userRouter.get("/verifyme", async (req, res) => {
  const user = req.user as User;
  if (!user) {
    res.send({ user: null });
  } else {
    res.json({ user: user.nickname });
  }
});

//creates a user
// userRouter.post("/createuser", async (req, res) => {
//   const body = req.body as User;
//   //console.log(body);
//   if (req.body.password === req.body.repeatPassword) {
//     const user = await prisma.user.findUnique({
//       where: {
//         nickname: body.nickname,
//       },
//     });
//     if (user) {
//       res.send("Sorry, that nickname is already taken, please try another one");
//       console.log("Nickname already taken");
//     } else {
//       await prisma.user.create({
//         data: {
//           email: body.email,
//           nickname: body.nickname,
//           password: await argonfuncs.default.hashArgon2(body.password),
//         },
//       });
//       console.log("Profile created!");
//       console.log(body);
//       res.send("Profile created!");
//     }
//   } else {
//     console.log("Passwords don't match.");
//     res.send("Passwords do not match, please try again.");
//   }
// });

//deletes user
// userRouter.delete("/delete/:name", async (req, res) => {
//   const userName = req.params.name;
//   const user = await prisma.user.delete({
//     where: {
//       nickname: userName,
//     },
//   });
// });

export = userRouter;
