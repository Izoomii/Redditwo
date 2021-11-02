import express from "express";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
//import { sha256 } from "js-sha256"; // currently using argon2 instead
import passport from "passport";
import authRouter, { post } from "./modules/auth";
import userRouter from "./modules/users";
import subredditRouter from "./modules/subreddits";
import localStrat from "./strategies/local";

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

//refers to the function that handles local strategy logic in local.ts
localStrat();

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

//main page
app.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(posts);
  //let cookie = getcookie(req);
  //console.log(cookie);
});

//says split undefined when executed in main page, probably because i test it without being logged in, can deal with it later.
function getcookie(req: any) {
  var cookie = req.headers.cookie;
  // user=someone; session=QyhYzXhkTZawIb5qSl3KKyPVN (this is my cookie i get)
  return cookie.split("; ");
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); //not adam literally copying this mn doc dial express, "Example app"
});
