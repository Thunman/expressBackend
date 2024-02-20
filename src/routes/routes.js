import express from "express";
import userController from "../controllers/userController";
import { limiter } from "../middleware/ratelimits/ratelimiter";

const userRouter = express.Router();

userRouter.post("/register", limiter, userController.register)
userRouter.post("/login", limiter, userController.login)

export default userRouter;