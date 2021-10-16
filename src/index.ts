import express from "express";
import { PrismaClient, User, Post } from "@prisma/client";
import { sha256 } from "js-sha256"; // currently using argon2 instead
import { hash, verify } from "argon2";

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

interface searchWords {
  words: string;
}

//testing password stuff
const hashArgon2 = async (password: string) => {
  try {
    const hashStr = await hash(password);
    return hashStr;
  } catch (err) {
    console.log(err);
  }
};

const passVerify = async (hashedPassword: string, password: string) => {
  if (await verify(hashedPassword, password)) {
    //console.log("success");
    return true;
  } else {
    //console.log("failed");
    return false;
  }
};

//hello world but it has a 2 at the end
app.get("/", (req, res) => {
  res.send("Hello World2!");
});

//finds all users registered
app.get("/users", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

//finds all posts of a subreddit
app.get(`/r/:subreddit`, async (req, res) => {
  const sub = req.params.subreddit;
  const allSubPosts = await prisma.post.findMany({
    where: {
      sub: sub,
    },
  });
  res.json(allSubPosts);
});

//finds all posts of a user
app.get(`/u/:user`, async (req, res) => {
  const theUser = req.params.user;
  const allUserPosts = await prisma.post.findMany({
    where: {
      authorName: theUser,
    },
  });
  res.json(allUserPosts);
});

//searches all posts in database for a specific keyword(s)
app.get("/searchposts", async (req, res) => {
  const keyWord = req.body as searchWords;
  const results = await prisma.post.findMany({
    where: {
      content: {
        contains: keyWord.words,
      },
    },
  });
  res.json(results);
});

//verifies a user's identity
app.get("/verifyme", async (req, res) => {
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
    let verify = passVerify(user.password, body.password);
    if ((await verify) == true) {
      res.send(`Your password is correct, welcome ${user.nickname}`);
    } else {
      res.send("Wrong password, please try again.");
    }
  }
});

//creates a user
app.post("/createuser", async (req, res) => {
  const body = req.body as User;
  console.log(body);
  if (req.body.password === req.body.repeatPassword) {
    await prisma.user.create({
      data: {
        email: body.email,
        nickname: body.nickname,
        password: await hashArgon2(body.password),
      },
    });
    console.log("Profile created!");
  } else {
    console.log("Passwords don't match.");
  }
});

//creates a new post for a user
app.post("/createpost", async (req, res) => {
  const body = req.body as Post;
  await prisma.post.create({
    data: {
      sub: body.sub,
      title: body.title,
      content: body.content,
      authorName: body.authorName,
    },
  });
});

//deletes user
app.delete("/u/:name", async (req, res) => {
  const userName = req.params.name;
  const user = await prisma.user.delete({
    where: {
      nickname: userName,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
