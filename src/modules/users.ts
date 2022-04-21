import { Router } from "express";
import { User } from "@prisma/client";
import prisma from "../libs/prisma";
import { hash } from "argon2";
import multer from "multer";

const userRouter = Router();

const destination =
  "/home/izumi/Documents/Redditwo/frontend/public/assets/avatars";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + file.originalname);
  },
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

//program tries to search for posts of user "verifyme", change the func responsible if u wanna test this

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

userRouter.post("/update", async (req, res) => {
  //debating whether it's worth it to add code just to not update all sections at the same time if it doesn't cost much
  const updatedInfo = req.body as updateInfo;
  const user = req.user as User;
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

const upload = multer({ storage: storage });
//update avatar
userRouter.post(
  "/updateavatar",
  upload.single("avatar"),
  // upload.fields([{ name: "newavatar" }]),
  async (req, res) => {
    const image = req.file;
    const user = req.user as User;
    console.log(req.body);
    // res.json(image);

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

interface createUserBody {
  nickname: string;
  email: string;
  password: string;
  name?: string;
}

//creates a user
userRouter.post("/createuser", async (req, res) => {
  const body = req.body as createUserBody;
  //console.log(body);
  if (req.body.password === req.body.repeatPassword) {
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
      res.json({
        message:
          "[IMPL] Sorry, those credentials are already taken, please try another one",
        users: existingUsers,
      });
      console.log("[IMPL] Credentials already taken");
    } else {
      await prisma.user.create({
        data: {
          email: body.email,
          nickname: body.nickname,
          password: await hash(body.password), //use original argon funcs, these ones are useless
        },
      });
      console.log("Profile created!");
      console.log(body);
      res.json({ message: "Profile created!", user: body });
    }
  } else {
    console.log("Passwords don't match.");
    res.send("Passwords do not match, please try again.");
  }
});

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
