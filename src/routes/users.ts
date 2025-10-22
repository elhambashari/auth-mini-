
import express from "express";
import type { Request, Response } from "express";
import { dynamoDB } from "../config/aws.js";
import auth from "../middlelware/auth.js";

const router = express.Router();

router.use(auth);

//  GET /api/users 
router.get("/", async (req: Request, res: Response) => {
  try {
    const params = { TableName: "user" };
    const data = await dynamoDB.scan(params).promise();
    res.json(data.Items);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

//  GET /api/users/:id 
router.get("/:username", async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const params = {
      TableName: "user",
      Key: { pk: `user#${username}`, sk: `profile#${username}` },
    };
    const data = await dynamoDB.get(params).promise();
    if (!data.Item) return res.status(404).json({ message: "User not found" });
    res.json(data.Item);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

//  PUT /api/users/:username 
router.put("/:username", async (req: Request, res: Response) => {
  const { username } = req.params;
  const { newUsername, password } = req.body;

  try {
    const params = {
      TableName: "user",
      Key: { pk: `user#${username}`, sk: `profile#${username}` },
      UpdateExpression: "set #u = :u, #p = :p",
      ExpressionAttributeNames: {
        "#u": "username",
        "#p": "password",
      },
      ExpressionAttributeValues: {
        ":u": newUsername,
        ":p": password,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamoDB.update(params).promise();
    res.json({ message: "User updated", result });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

//  DELETE /api/users/:username 
router.delete("/:username", async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const params = {
      TableName: "user",
      Key: { pk: `user#${username}`, sk: `profile#${username}` },
    };
    await dynamoDB.delete(params).promise();
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

export default router;
