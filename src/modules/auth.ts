import { Router } from "express";
import { authenticate } from "passport";
import prisma from "../libs/prisma";
import { User } from "@prisma/client";
import { hash, verify } from "argon2";
import { isAuthentified } from "../libs/middleware/auth";

const authRouter = Router();

//old version of the code that doesn't work but im keeping for future reference

// authRouter.post("/login", authenticate("local"), (req, res) => {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   res.send(200);
// });

//does the same thing as /users/:nickname ??
//probably better to verify here
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

// authRouter.get("/login", (req, res, next) => {
//   if (!req.user) {
//     res.json({ message: "Login page. You are not logged in" });
//     console.log("No user, staying on the same page");
//   } else {
//     res.redirect("/");
//   }
// });

authRouter.post("/login", (req, res, next) => {
  authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // console.log(info); //info contains the error message
      res.json({ authenticate: false, message: info.message });
    } else {
      // if user authenticated maintain the session
      req.logIn(user, function () {
        // do whatever here on successful login
        console.log(user);
        res.json({ authenticate: true, message: info.message });
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

interface passwordChangeRequest {
  original: string;
  new: string;
  repeat: string;
}
 
authRouter.post("/passwordchange", isAuthentified, async (req, res) => {
  const user = req.user as User;
  const passwords = req.body as passwordChangeRequest;
  console.log(passwords);
  const existingUser = await prisma.user.findUnique({
    where: {
      nickname: user.nickname,
    },
  });
  if (await verify(existingUser.password, passwords.original)) {
    // console.log("Original password correct");
    if (passwords.new === passwords.repeat && passwords.new !== "") {
      try {
        await prisma.user.update({
          where: {
            nickname: user.nickname,
          },
          data: {
            password: await hash(passwords.new),
          },
        });
        console.log(`Password of user "${user.nickname}" changed.`);
        req.logOut();
        res.json({ passwordChanged: true });
      } catch {
        res.json({
          passwordChanged: false,
        });
      }
    } else {
      console.log("Repeated password doesn't match");
    }
  } else {
    console.log("Original password doesn't match.");
  }
});

export = authRouter;
