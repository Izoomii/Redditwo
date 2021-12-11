import React from "react";
import ReactDOM from "react-dom";
import next from "next";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

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
//import { any, string } from "joi";
//import { type } from "os";
const port = 3000;
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = express();

  server.use(
    session({
      secret: "some secret",
      cookie: { maxAge: 30000 }, //how long the cookie stays
      resave: true,
      saveUninitialized: false,
    })
  );

  //correct syntax but need to show it.
  // ReactDOM.render(React.createElement(App), document.getElementById("root"));

  //server.set("view engine", "pug");
  server.use(express.urlencoded({ extended: true }));

  //refers to the function that handles local strategy logic in local.ts
  localStrat();

  passport.serializeUser((user: User, done) => {
    done(null, user);
  });
  passport.deserializeUser((user: User, done) => {
    done(null, user);
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.use("/auth", authRouter);
  server.use(userRouter);
  server.use(subredditRouter);

  let str: Array<any> = ["A", "B", 3];
  console.log(str);

  //this makes it work but stops responding after rendering first page and node keeps running with 25% cpu power even after terminating the server
  //it is specifically the "*" part, its what's causing this entire thing but also the thing that enables it to compile the first time :/
  //
  // server.all("*", (req, res) => {
  //   return handle(req, res);
  // });

  server.get("/index", async (req, res) => {
    return handle(req, res);
    //says it compiled it, doesnt show anything
  });

  server.get("/test", async (req, res) => {
    try {
      //rendering test page should be here...
      //res.send("test page ok");
    } catch (err) {
      console.log(err, "\nrender failed");
    }
  });

  //main page
  server.get("/", async (req, res) => {
    //console.log(req.session);
    const posts = await prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(posts);
    let cookie = getcookie(req);
    if (cookie == undefined) {
      console.log("No cookie created yet.");
    } else {
      console.log(cookie);
    }
  });

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

  server.listen(port, () => {
    console.log(`Example server listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example server"
  });

  //this bracket closes the app.prepare, which envelops the entire code here
});
