import express from "express";
import { PrismaClient, User, Post } from "@prisma/client";

//import { sha256 } from "js-sha256"; // currently using argon2 instead
//import { hash, verify } from "argon2"; // imported in user module, where it's needed

import { authenticate } from "passport";
//import {} from "passport-strategy"; // tf are u doing
import userRouter from "./modules/users";
import subredditRouter from "./modules/subreddits";

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(userRouter, subredditRouter);

//hello world but it has a 2 at the end
app.get("/", (req, res) => {
  res.send("Hello World2! Main Page.");
});

// app.post(
//   "/login",
//   authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example app"
});
