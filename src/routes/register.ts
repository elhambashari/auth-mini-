import express from "express";
import type { Request, Response, NextFunction } from "express";

import { dynamoDB } from "../config/aws.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email and password are required" });
  }

  const params = {
    TableName: "user", // اسم دقیق جدول DynamoDB تو
    Item: {
      pk: `user#${username}`,
      sk: `profile#${username}`,
      email,
      password,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(201).json({ message: "User saved successfully", user: { username, email } });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Could not save user" });
  }
});

export default router;
