import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	hasNewMessages: {
		type: Boolean,
	},
	showEmail: {
		type: Boolean,
	},
	userInfo: {
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		age: {
			type: String,
		},
		location: {
			type: String,
		},
		aboutText: {
			type: String,
		},
		profilePicUrl: {
			type: String,
		},
	},
});

export const messageSchema = mongoose.Schema({
	sender: {
		type: String,
	},
	reciver: {
		type: String,
	},
	text: {
		type: String,
	},
	timeStamp: {
		type: Date,
	},
});

export const profileInfoSchema = mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	age: {
		type: String,
	},
	location: {
		type: String,
	},
	aboutText: {
		type: String,
	},
	profilePicUrl: {
		type: String,
	},
});
