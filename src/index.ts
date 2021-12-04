import React from "react";
import ReactDOM from "react-dom";

import App from "./test";
//import registerServiceWorker from './registerServiceWorker';

//registerServiceWorker();

import express from "express";
import { PrismaClient, User, Post } from "@prisma/client";
import session from "express-session";
//import { sha256 } from "js-sha256"; // currently using argon2 instead
import passport from "passport";
import authRouter from "./modules/auth";
import userRouter from "./modules/users";
import subredditRouter from "./modules/subreddits";
import localStrat from "./strategies/local";
import { any, string } from "joi";
import { type } from "os";
//import { render } from "pug"; //not needed, express can call it in view engine
//import { renderFile, render } from "pug";
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(
  session({
    secret: "some secret",
    cookie: { maxAge: 30000 }, //how long the cookie stays
    resave: true,
    saveUninitialized: false,
  })
);

//correct syntax but need to show it.
// ReactDOM.render(React.createElement(App), document.getElementById("root"));

//app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

//refers to the function that handles local strategy logic in local.ts
localStrat();

passport.serializeUser((user: User, done) => {
  done(null, user);
});
passport.deserializeUser((user: User, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use(userRouter);
app.use(subredditRouter);

let str: Array<any> = ["A", "B", 3];

console.log(str);

app.get("/test", async (req, res) => {
  try {
    if (typeof window !== "undefined") {
      console.log("window type defined, condition met -__-");
      ReactDOM.render(
        React.createElement(App),
        document.getElementById("root")
      );
    }
    //res.render("404.pug");
  } catch (err) {
    console.log(err, "\nrender failed");
  }
});

//main page
app.get("/", async (req, res) => {
  //console.log(req.session);
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });
  //res.render("main.pug", renderMain(posts));
  res.send(posts);
  let cookie = getcookie(req);
  if (cookie == undefined) {
    console.log("No cookie created yet.");
  } else {
    console.log(cookie);
  }
});

interface LooseObject {
  [key: string]: any;
}

function renderMain(posts: Post[]) {
  let obj: LooseObject = {};
  posts.forEach((e, i) => {
    obj[`postTitle${i}`] = e.title;
    obj[`postAuthor${i}`] = e.authorName;
    obj[`postContent${i}`] = e.content;
    //console.log(obj);
  });
  return obj;
}

function getcookie(req: any) {
  try {
    var cookie = req.headers.cookie;
    // user=someone; session=QyhYzXhkTZawIb5qSl3KKyPVN (this is my cookie i get)
    console.log("Cookie:");
    return cookie.split("; ");
  } catch {
    console.log("Error fetching cookie from header.");
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example app"
});
