import { Router } from "express";
import { Premium, User } from "@prisma/client";
import prisma from "../libs/prisma";
import { hash } from "argon2";
import { verifyPasswordStrength } from "../libs/globalVars";
import { isAuthentified } from "../libs/middleware/auth";
import { uploadSingle } from "../libs/middleware/uploadImage";
import { avatarsDestination } from "../libs/globalVars";
import { unlinkSync } from "fs";

const userRouter = Router();

//update avatar
userRouter.post(
  "/updateavatar",
  isAuthentified,
  uploadSingle("avatar", avatarsDestination),
  async (req, res) => {
    const image = req.file;
    if (!image) return console.log("No image uploaded");
    const user = req.user as User;

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        avatar: image.filename,
      },
    });
    req.logIn(updatedUser, (err) => {
      // if (!err) console.log("Successfully updated user", updatedUser);
    });
    res.json({ updated: true, updatedUser });
    res.end();
  }
);

userRouter.post("/deleteavatar", isAuthentified, async (req, res) => {
  const user = req.user as User;
  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      avatar: null,
    },
  });
  req.logIn(updateUser, (err) => {
    if (!err) return res.json(updateUser);
  });
});

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
  const nickname = req.query.nickname as string;
  //CHNL
  if (nickname === undefined || nickname === "") {
    return res.status(400).send("No user defined"); // ?? bro fix this spaghetti code
  }
  const userInfo = await prisma.user.findUnique({
    where: {
      nickname,
    },
    select: {
      avatar: true,
      nickname: true,
      name: true,
      posts: true,
    },
  });
  res.json(userInfo);
  console.log(`Searched posts of user ${nickname}`);
  if (req.user) {
    const connectedUser = req.user as User;
    if (connectedUser.nickname == nickname) {
      console.log(connectedUser.nickname + " It's you!");
    }
  }
});

userRouter.post("/premium/activate", isAuthentified, async (req, res) => {
  const user = req.user as User;
  const body = req.body as Premium;
  const existingPremium = await prisma.premium.findUnique({
    where: {
      userId: user.id,
    },
  });
  const configurePremium = existingPremium
    ? await prisma.premium.update({
        where: {
          userId: user.id,
        },
        data: {
          expiration: body.expiration,
          active: true,
        },
      })
    : await prisma.premium.create({
        data: {
          userId: user.id,
          expiration: body.expiration,
          active: true,
        },
      });
  res.json(configurePremium);
});

//program tries to search for posts of user "verifyme", change the func responsible if u wanna test this IMPL
// verifies a user's identity
userRouter.get("/verifyme", async (req, res) => {
  const user = req.user as User;
  if (!user) {
    res.json({ user: null });
  } else {
    res.json({ user });
  }
});

userRouter.post("/logout", async (req, res) => {
  req.logOut();
  res.json({ authenticate: false, message: "Logged out" });
});

interface updateInfo {
  email?: string;
  nickname?: string;
  name?: string;
}

userRouter.post("/update", isAuthentified, async (req, res) => {
  //debating whether it's worth it to add code just to not update all sections at the same time if it doesn't cost much
  const updatedInfo = req.body as updateInfo;
  const user = req.user as User;
  if (updatedInfo.name === "") updatedInfo.name = null; //CHNL before adding nickname space check

  const nicknameSplit = updatedInfo.nickname.split(" ");
  if (nicknameSplit.length !== 1)
    return res.json({ message: "Nickname can't have spaces" });
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: updatedInfo,
    });

    req.logIn(updatedUser, (err) => {
      // if (!err) console.log("Successfully updated user", updatedUser);
    });
    res.json({ updated: true, updatedUser });
    res.end();
  } catch {
    res.json({
      message:
        "[IMPL] An error has occured. (could be multiple types of errors)",
    });
  }
});

//creates a user
userRouter.post(
  "/createuser",
  uploadSingle("avatar", avatarsDestination),
  async (req, res) => {
    const user = req.user as User;
    if (user)
      return res.json({
        message: "Cannot create a user if you're already logged in.",
      });
    const body = req.body as User;
    const image = req.file;

    const nicknameSplit = body.nickname.split(" ");
    if (nicknameSplit.length !== 1) {
      if (image) unlinkSync(avatarsDestination + image.filename);
      return res.json({ message: "Nickname can't have spaces" });
    }

    if (!verifyPasswordStrength(body.password)) {
      if (image) unlinkSync(avatarsDestination + image.filename); //IMPL repeated multiple times it's giving me cancer
      return res.json({ message: "Password requirements don't match" });
    }
    if (req.body.password !== req.body.repeatPassword) {
      if (image) unlinkSync(avatarsDestination + image.filename);

      console.log("Passwords don't match.");
      res.json({ message: "Passwords do not match, please try again." });
    } else {
      const existingUsers = await prisma.user.findMany({
        where: {
          OR: [
            {
              nickname: body.nickname,
            },
            {
              email: body.email,
            },
          ],
        },
      });
      if (existingUsers.length != 0) {
        if (image) unlinkSync(avatarsDestination + image.filename);
        res.json({
          message:
            "[IMPL] Sorry, those credentials are already taken, please try other ones",
          users: existingUsers,
        });
        console.log("[IMPL] Credentials already taken");
      } else {
        const newUser = image
          ? await prisma.user.create({
              data: {
                email: body.email,
                nickname: body.nickname,
                password: await hash(body.password),
                avatar: image.filename,
              },
            })
          : await prisma.user.create({
              data: {
                email: body.email,
                nickname: body.nickname,
                password: await hash(body.password),
              },
            });
        req.logIn(newUser, (err) => {
          if (!err) console.log(`Logged in new user.`);
          console.log(newUser);
        });
        res.json({ message: "Profile created!", user: newUser });
      }
    }
  }
);

//deletes user
userRouter.delete("/delete/:userId", async (req, res) => {
  const userId = req.params.userId;
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!existingUser) return res.json({ message: "User doesn't exist" });
  const deletedUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  res.json({ message: `Deleted user "${deletedUser.nickname}" :(` });
});

export = userRouter;
