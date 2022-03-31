//front end port
export const frontPort = 3000;

export const getcookie = (req: any) => {
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
