import { Router } from "express";
import { authenticate } from "passport";

const authRouter = Router();

//old version of the code that doesn't work but im keeping for future reference

// authRouter.post("/login", authenticate("local"), (req, res) => {
//   // If this function gets called, authentication was successful.
//   // `req.user` contains the authenticated user.
//   res.send(200);
// });

authRouter.post("/login", (req, res, next) =>
  authenticate("local", {
    successRedirect: "/",
    /*failureRedirect: "/auth",*/
  })(req, res, next)
);

export = authRouter;
