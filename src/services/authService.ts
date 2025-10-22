
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const signUser = (user: User) => {
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  return token;
};
