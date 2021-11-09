import { Router } from "express";
import { authenticate } from "passport";
import { User } from "@prisma/client";

const authRouter = Router();

//old version of the code that doesn't work but im keeping for future reference

// authRouter.post("/login", authenticate("local"), (req, res) => {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   res.send(200);
// });

authRouter.get("/login", (req, res, next) => {
  if (!req.user) {
    res.render("main.pug", { loginTitle: "Login Page" });
  } else {
    res.redirect("/");
    //let user = req.user as User;
    // res.render("main.pug", {
    //   loginTitle: `You are already logged in ${user.nickname}!`,
    // });
  }
});

authRouter.post("/login", (req, res, next) => {
  //console.log(authenticate);
  console.log("called auth");
  return authenticate("local", {
    successRedirect: "/",
    //failureRedirect: "/auth",
  })(req, res, next);
});

export = authRouter;
