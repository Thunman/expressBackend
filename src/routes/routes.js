import express from "express";
import userController from "../controllers/userController.js";
import { limiter } from "../middleware/ratelimits/ratelimiter.js";
import { auth } from "../middleware/auhtentication/autentication.js";

export const userRouter = express.Router();

userRouter.post("/register", limiter, userController.register);
userRouter.post("/login", limiter, userController.login);
userRouter.post("/sendMessage", limiter, auth, userController.sendMessage);
userRouter.get("/getAllUsers", limiter, auth, userController.getAllUsers);
userRouter.post("/updateProfileInformation", limiter, auth, userController.updateProfileInfo);
userRouter.post("/token", userController.refreshToken);