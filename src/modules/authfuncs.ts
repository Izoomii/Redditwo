import { hash, verify } from "argon2";

//hash function using argon2
const hashArgon2 = async (password: string) => {
  try {
    const hashStr = await hash(password);
    return hashStr;
  } catch (err) {
    console.log(err);
  }
};

//verifies a user with their password
const passVerify = async (hashedPassword: string, password: string) => {
  if (await verify(hashedPassword, password)) {
    //console.log("success");
    return true;
  } else {
    //console.log("failed");
    return false;
  }
};

export default { hashArgon2, passVerify };
