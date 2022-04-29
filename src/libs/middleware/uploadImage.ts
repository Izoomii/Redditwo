import multer, { Multer } from "multer";
import path from "path";

// const destination =
//   "/home/izumi/Documents/Redditwo/frontend/public/assets/avatars";

// upload.fields([{ name: "newavatar" }])

export function uploadSingle(name: string, destination: string) {
  const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      // console.log(file);
      cb(null, Date.now() + file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
    fileFilter: function (_req, file, cb) {
      checkFileType(file, cb);
    },
  });
  return upload.single(name);
}

//CHNL cb type
function checkFileType(file: Express.Multer.File, cb: any) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
