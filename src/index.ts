import express from "express";
import { PrismaClient } from "@prisma/client";
import session from "express-session";

//import { sha256 } from "js-sha256"; // currently using argon2 instead
//import { hash, verify } from "argon2"; // imported in user module, where it's needed

import passport from "passport";
import { Strategy } from "passport-local";
import authRouter from "./modules/auth";
import userRouter from "./modules/users";
import subredditRouter from "./modules/subreddits";
import * as argonfuncs from "./modules/authfuncs";

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(
  session({
    secret: "some secret",
    cookie: { maxAge: 30000 },
    resave: true,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: true }));

//something is wrong with this, shows bad request in insomnia
passport.use(
  new Strategy(
    {
      usernameField: "nickname",
      passwordField: "password",
    },
    async (nickname, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            nickname: nickname,
          },
        });
        if (!user) {
          return done(null, false, { message: "No such user." });
        } else {
          let verify = argonfuncs.default.passVerify(user.password, password);
          if ((await verify) == true) {
            console.log(user);
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong password." });
          }
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

const test = () => {};

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use(userRouter);
app.use(subredditRouter);

//hello world but it has a 2 at the end
app.get("/", (req, res) => {
  res.send("Hello World2! Main Page.");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example app"
});
