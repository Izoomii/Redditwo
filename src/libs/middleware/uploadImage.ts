import multer from "multer";

// const destination =
//   "/home/izumi/Documents/Redditwo/frontend/public/assets/avatars";

// upload.fields([{ name: "newavatar" }])

export function uploadSingle(name: string, destination: string) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      // console.log(file);
      cb(null, Date.now() + file.originalname);
    },
  });
  const upload = multer({ storage: storage });
  return upload.single("avatar");
}
