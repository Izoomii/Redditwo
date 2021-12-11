import { User } from "@prisma/client";
import passport from "passport";

const serialization = () => {
  passport.serializeUser((user: User, done) => {
    done(null, user);
  });
  passport.deserializeUser((user: User, done) => {
    done(null, user);
  });
};

export = serialization;
