
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { dynamoDB } from "../config/aws.js";
import { signUser } from "../services/authService.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required" });

  try {
    const params = {
      TableName: "user",
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `user#${username}`,
      },
    };

    const result = await dynamoDB.query(params).promise();
    const user = result.Items?.[0];

    if (!user) return res.status(401).json({ message: "User not found" });

    // 🧠 بررسی رمز با bcrypt.compare
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    const token = signUser({
      id: user.pk,
      username,
      email: user.email,
    } as any);

    return res.json({
      message: "Login successful ✅",
      token,
      user: { username, email: user.email },
    });

  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Could not sign in" });
  }
});

export default router;
