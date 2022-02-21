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
  authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.json(info); //info contains the error message
      //res.redirect("http://localhost:3000/account");
    } else {
      // if user authenticated maintain the session
      req.logIn(user, function () {
        // do whatever here on successful login
        res.redirect("http://localhost:3000/main");
      });
    }
  })(req, res, next);
});

/*
//copied this from passportjs docs

app.post('/login/password',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/~' + req.user.username);
  });
*/

export = authRouter;
