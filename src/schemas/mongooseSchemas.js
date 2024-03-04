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
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conversation" }],
    hasNewMessages: {
        type: Boolean,
    },
    showEmail: {
        type: Boolean,
    },
    userInfo: {
        name: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
    },
    timeStamp: {
        type: Date,
    },
});

export const conversationSchema = mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
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