import React from "react";
import ReactDOM from "react-dom";
import next from "next";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
import express from "express";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
//import { sha256 } from "js-sha256"; // currently using argon2 instead
import passport from "passport";
import authRouter from "./modules/auth";
import userRouter from "./modules/users";
import subredditRouter from "./modules/subreddits";
import localStrat from "./strategies/local";
import serialization from "./strategies/serialization";
//import { any, string } from "joi";
//import { type } from "os";
const port = 3000;
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = express();
  server.use(express.urlencoded({ extended: true }));
  server.use(
    session({
      secret: "some secret",
      cookie: { maxAge: 30000 }, //how long the cookie stays
      resave: true,
      saveUninitialized: false,
    })
  );
  //refers to the function that handles local strategy logic in local.ts and the one that serializes/deserializes user respectively
  localStrat();
  serialization();

  server.use(passport.initialize());
  server.use(passport.session());

  server.use("/auth", authRouter);
  server.use(userRouter);
  server.use(subredditRouter);

  server.all("/", (_, res) => {
    res.redirect("/main");
  });

  //this makes it work but stops responding after rendering first page and node keeps running with 25% cpu power even after terminating the server
  //it is specifically the "*" part, its what's causing this entire thing but also the thing that enables it to compile the first time :/
  //
  // server.all("*", (req, res) => {
  //   console.log("Activated server.all('*') function");
  //   return handle(req, res);
  // });

  server.get("/test", async (req, res) => {
    try {
      console.log("in /test");
    } catch (err) {
      console.log(err, "\nrender failed");
    }
  });

  server.listen(port, () => {
    console.log(`Example server listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example server"
  });

  //this bracket closes the app.prepare, which envelops the entire code here
});
