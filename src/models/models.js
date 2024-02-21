import {
	userSchema,
	messageSchema,
	profileInfoSchema,
} from "../schemas/mongooseSchemas.js";
import mongoose from "mongoose";

export const User = mongoose.model("User", userSchema);
export const Message = mongoose.model("Message", messageSchema);
export const ProfileInfo = mongoose.model("ProfileInfo", profileInfoSchema);
