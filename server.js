import express from "express";
import { readFileSync } from "fs";
import https from "https";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userRouter } from "./src/routes/routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

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
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use("/api/users", userRouter);
app.use(express.static(path.join(__dirname, "public")));

const stopServer = () => {
	return new Promise((resolve, reject) => {
		mongoose.connection
			.close()
			.then(() => {
				server.close((err) => {
					if (err) {
						reject(err);
						return;
					}
					resolve();
				});
			})
			.catch(reject);
	});
};

const startServer = async () => {
	try {
		await mongoose.connect(mongoUrl);
		server.listen(port, (error) => {
			if (error) console.error(error);
		});
		return app;
	} catch (error) {
		console.error(error);
	}
};

startServer();

export { startServer, stopServer };
