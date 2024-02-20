import bcrypt from "bcrypt";
import { Message, User } from "../models/models";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import {
	registerValidators,
	loginValidators,
    sendMessageValidators,
} from "../middleware/validators/userValidator";


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
					return res
						.status(401)
						.json({ message: "Invalid Email or Password" });
				const accesToken = jwt.sign(
					{ id: user._id, email: user.email },
					process.env.JWT_SECRET,
					{ expiresIn: "1h" }
				);
				res.status(200).json({ message: "Welcome", token: accesToken });
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
            const { sender, reciver, content, timeStamp } = req.body;
            const token = req.headers['authorization'];
            try {
                jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            const senderUser = await User.findOne({ email: sender });
            const reciverUser = await User.findOne({ email: reciver });
            if (!reciverUser)
                return res.status(401).json({ message: "Receiver does not exist" });
            const newMessage = new Message({
                sender: sender,
                reciver: reciver,
                text: content,
                timeStamp: timeStamp,
            });
            await newMessage.save();
            senderUser.messages.push(newMessage._id);
            reciverUser.messages.push(newMessage._id);
            await senderUser.save();
            await reciverUser.save();
            res.status(201).json({ message: "Message sent" });
        }
    ],  
    
};
export default userController;
