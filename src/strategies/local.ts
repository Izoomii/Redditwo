//handles local strategy logic with auth.ts
import { Strategy } from "passport-local";
import passport from "passport";
import { PrismaClient, User } from "@prisma/client";
import * as argonfuncs from "../modules/authfuncs";

const prisma = new PrismaClient();
const localStrat = () => {
  passport.use(
    new Strategy(
      {
        usernameField: "nickname",
        passwordField: "password",
      },
      async (nickname, password, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              nickname: nickname,
            },
          });
          if (!user) {
            console.log("No user with this nickname");
            return done(null, false, { message: "No such user." });
          } else {
            let verify = argonfuncs.default.passVerify(user.password, password);
            if ((await verify) == true) {
              console.log(`Connected ${user.nickname}`);
              return done(null, user, { message: "Authenticated" });
            } else {
              console.log("Wrong password");
              return done(null, false, { message: "Wrong password." });
            }
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export = localStrat;
