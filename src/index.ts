// const dev = process.env.NODE_ENV !== "production";

import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import authRouter from "./modules/auth";
import userRouter from "./modules/users";
import subredditRouter from "./modules/subreddits";
import postRouter from "./modules/posts";
import localStrat from "./strategies/local";
import serialization from "./strategies/serialization";
import { frontURL } from "./libs/globalVars";
import testRouter from "./modules/test";
import searchRouter from "./modules/search";
import mainRouter from "./modules/mainRouter";
import chatRouter from "./modules/chats";

const port = 8080;

const server = express();
server.use(
  session({
    secret: "some secret",
    cookie: { /*maxAge: 60000, */ sameSite: false, secure: false }, //change later CHNL
    resave: true,
    saveUninitialized: false,
  })
);

const corsParams = {
  origin: frontURL,
  credentials: true,
};
server.use(cors(corsParams));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//refers to the function that handles local strategy logic in local.ts and the one that serializes/deserializes user respectively
localStrat();
serialization();

server.use(passport.initialize());
server.use(passport.session());

server.use(mainRouter);
server.use("/auth", authRouter);
server.use("/posts", postRouter);
server.use("/users", userRouter);
server.use("/subs", subredditRouter);
server.use("/search", searchRouter);
server.use("/chats", chatRouter);

//test router
server.use("/test", testRouter);

// server.all("/", (_, res) => {
//   //temporary redirect until i give main page its own router or smtg, CHNL
//   res.redirect("/posts/all");
// });

server.listen(port, () => {
  console.log(`Example server listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example server"
});
