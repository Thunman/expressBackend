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
