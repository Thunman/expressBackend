import bcrypt from "bcrypt";
import { Message, User } from "../models/models.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import {
  registerValidators,
  loginValidators,
  sendMessageValidators,
} from "../middleware/validators/userValidator.js";
import { sendEmail } from "../mailer/mailer.js";

const saltRounds = 10;

const userController = {
  register: [
    ...registerValidators,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const { userName, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist)
          return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
          userName,
          email,
          password: hashedPassword,
          messages: [],
          userInfo: {
            name: "",
            age: "",
            location: "",
            aboutText: "",
            profilePicUrl: "",
          },
          hasNewMessages: false,
          showEmail: false,
        });
        await newUser.save();
        res.status(201).json({ message: "User Created" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    },
  ],

  login: [
    ...loginValidators,
    async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
          return res.status(401).json({ message: "Invalid Email or Password" });
        const accesToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.REFRESH_TOKEN_SECRET
        );
        let userObj = user.toObject();
        userObj.token = accesToken;
        delete userObj.password;
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
        res.cookie("token", accesToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });
        res.cookie("loggedIn", true, {
          secure: true,
          sameSite: "None",
        });
        res.status(200).json({
          success: true,
          user: userObj,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    },
  ],
  sendMessage: [
    ...sendMessageValidators,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { senderId, reciverId, text, timeStamp } = req.body;
      const senderUser = await User.findOne({ _id: senderId });
      const reciverUser = await User.findOne({ _id: reciverId });
      if (!senderUser)
        return res.status(401).json({ message: "Sender does not exist" });
      if (!reciverUser)
        return res.status(401).json({ message: "Receiver does not exist" });
      const newMessage = new Message({
        sender: senderId,
        reciver: reciverId,
        text: text,
        timeStamp: timeStamp,
      });
      await newMessage.save();
      senderUser.messages.push(newMessage._id);
      reciverUser.messages.push(newMessage._id);
      await senderUser.save();
      await reciverUser.save();
      res.status(201).json({ message: "Message sent" });
    },
  ],
  updateProfileInfo: async (req, res) => {
    let userObj = req.body;
    let user = await User.findOne({ _id: userObj._id });
    if (!user) return res.status(403).json({ message: "Invalid UID" });
    Object.assign(user, userObj);
    await user.save();
    return res.status(201).json({ message: "Info Saved" });
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(403).json({ message: "No refresh token provided" });
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const accessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET
      );
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  passwordReset: async (req, res) => {
    const user = await User.findOne(req.body.email);
    if (!user)
      return res
        .status(404)
        .json({ message: "No user exists with given email" });
    user.resetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetExpire = Date.now() + 3600000;
    await user.save();
    const resetUrl = `https://${req.header.host}/reset/${user.resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password reset",
      text: `Follow this link to reset password: ${resetUrl}`,
    });
  },
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    user.password = await bcrypt.hash(password, saltRounds);
    user.resetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();
    res.status(200).json({ message: "Password changed" });
  },
};
export default userController;
