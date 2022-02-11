import { Router } from "express";
import { authenticate } from "passport";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
const authRouter = Router();

//old version of the code that doesn't work but im keeping for future reference

// authRouter.post("/login", authenticate("local"), (req, res) => {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   res.send(200);
// });

authRouter.get("/:user", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      nickname: req.params.user,
    },
  });
  if (user) {
    res.json({ nickname: user.nickname });
  } else {
    res.json({ nickname: null });
  }
});

authRouter.get("/login", (req, res, next) => {
  //res.render("login.pug");
  if (!req.user) {
    res.send("Login page. You are not logged in");
    //res.render("404.pug");
    console.log("No user, staying on the same page");
  } else {
    res.redirect("/");
    //let user = req.user as User;
    // res.render("login.pug", {
    //   loginTitle: `You are already logged in ${user.nickname}!`,
    // });
  }
});

authRouter.post("/login", (req, res, next) => {
  //console.log(authenticate);
  return authenticate("local", {
    //originally the redirects used to take user to backend port, changed to :3000 for front end
    successRedirect: "http://localhost:3000/main",
    //temp failsafe for failed logins.
    // failureRedirect: "http://localhost:3000/account",
  })(req, res, next);
});

export = authRouter;
