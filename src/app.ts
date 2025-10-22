
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./middlelware/logger.js"; 
import registerRouter from "./routes/register.js";
import signinRouter from "./routes/signin.js";
import usersRouter from "./routes/users.js";
import signupRoute from "./routes/signup.js";
import signinRoute from "./routes/signin.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/register", registerRouter);
app.use("/api/signin", signinRouter);
app.use("/api/users", usersRouter);

app.use("/api/signup", signupRoute);
app.use("/api/signin", signinRoute);

export default app;
