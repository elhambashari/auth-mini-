
import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { dynamoDB } from "../config/aws.js";
import { signUser } from "../services/authService.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    
    const existing = await dynamoDB.query({
      TableName: "user",
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": `user#${username}`,
      },
    }).promise();

    if (existing.Items && existing.Items.length > 0)
      return res.status(400).json({ message: "User already exists" });

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = {
      pk: `user#${username}`,
      sk: "profile",
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.put({
      TableName: "user",
      Item: newUser,
    }).promise();

    const token = signUser({
      id: newUser.pk,
      username,
      email,
    } as any);

    res.status(201).json({
      message: "User registered successfully ✅",
      token,
      user: { username, email },
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Could not register user" });
  }
});

export default router;
