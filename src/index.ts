// const dev = process.env.NODE_ENV !== "production";

import express from "express";
import session from "express-session";
import passport from "passport";
import authRouter from "./modules/auth";
import userRouter from "./modules/users";
import subredditRouter from "./modules/subreddits";
import postRouter from "./modules/posts";
import localStrat from "./strategies/local";
import serialization from "./strategies/serialization";

const port = 8080;

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(
  session({
    secret: "some secret",
    cookie: { maxAge: 60000 }, //how long the cookie stays
    resave: true,
    saveUninitialized: false,
  })
);

//two of the same thing
// server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//refers to the function that handles local strategy logic in local.ts and the one that serializes/deserializes user respectively
localStrat();
serialization();

server.use(passport.initialize());
server.use(passport.session());

server.use("/auth", authRouter);
server.use("/posts", postRouter);
server.use("/users", userRouter);
server.use("/subs", subredditRouter);

server.all("/", (_, res) => {
  res.redirect("/main");
});

server.get("/test", async (req, res) => {
  try {
    res.send("Test page here");
    console.log("in /test");
  } catch (err) {
    console.log(err, "\nrender failed");
  }
});

//app.prepare().then(() => {
// server.all("*", (req, res) => {
//   console.log("server all '*' req triggered.");
// });
server.listen(port, () => {
  console.log(`Example server listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example server"
});
