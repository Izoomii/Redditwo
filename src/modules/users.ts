import { Router } from "express";
import { PrismaClient, User } from "@prisma/client";
import * as argonfuncs from "../modules/authfuncs";

const prisma = new PrismaClient();

const userRouter = Router();

//finds all users registered
userRouter.get("/users", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
  console.log("Searched for all users");
});

//finds all posts of a user
userRouter.get(`/u/:user`, async (req, res) => {
  const theUser = req.params.user;
  const allUserPosts = await prisma.post.findMany({
    where: {
      authorName: theUser,
    },
  });
  res.json(allUserPosts);
  console.log(`Searched posts of user ${theUser}`);
});

//verifies a user's identity
userRouter.get("/verifyme", async (req, res) => {
  const body = req.body;
  //console.log(body);
  const user = await prisma.user.findUnique({
    where: {
      nickname: body.nickname,
    },
  });
  //console.log(user);
  if (user == null) {
    res.send("There is no user with that nickname, please try again.");
  } else {
    let verify = argonfuncs.default.passVerify(user.password, body.password);
    if ((await verify) == true) {
      res.send(`Your password is correct, welcome ${user.nickname}`);
    } else {
      res.send("Wrong password, please try again.");
    }
  }
});

//creates a user
userRouter.post("/createuser", async (req, res) => {
  const body = req.body as User;
  //console.log(body);
  if (req.body.password === req.body.repeatPassword) {
    const user = await prisma.user.findUnique({
      where: {
        nickname: body.nickname,
      },
    });
    if (user) {
      res.send("Sorry, that nickname is already taken, please try another one");
      console.log("Nickname already taken");
    } else {
      await prisma.user.create({
        data: {
          email: body.email,
          nickname: body.nickname,
          password: await argonfuncs.default.hashArgon2(body.password),
        },
      });
      console.log("Profile created!");
      console.log(body);
      res.send("Profile created!");
    }
  } else {
    console.log("Passwords don't match.");
    res.send("Passwords do not match, please try again.");
  }
});

//deletes user
userRouter.delete("/u/:name", async (req, res) => {
  const userName = req.params.name;
  const user = await prisma.user.delete({
    where: {
      nickname: userName,
    },
  });
});

export = userRouter;
