import express from "express";
import { readFileSync } from "fs";
import https from "https";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
const sslKey = process.env.SSL_KEY_PATH;
const sslCert = process.env.SSL_CERT_PATH;
const options = {
	key: readFileSync(sslKey),
	cert: readFileSync(sslCert),
};

const app = express();
const server = https.createServer(options, app);

const startServer = async () => {
	try {
		await mongoose.connect(mongoUrl);
		server.listen(port, (error) => {
			if (error) console.error(error);
			else console.log(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error(error);
	}
};

startServer();
app.get("/", (req, res) => {
	res.send("Hi");
});
