import { Request } from "express";

//front end port
export const frontPort = 3000;

export const avatarPath =
  "/home/izumi/Documents/Redditwo/frontend/public/assets/avatars";

export const getcookie = (req: Request) => {
  try {
    const cookie = req.headers.cookie;
    // user=someone; session=QyhYzXhkTZawIb5qSl3KKyPVN (this is my cookie i get)
    console.log("Cookie:");
    console.log(cookie.split("; "));
    // return cookie.split("; ");
  } catch {
    console.log("Error fetching cookie from header.");
  }
};

export const verifyPasswordStrength = (password: string) => {
  const check = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  return check.test(password);
};
