import express from "express";
import { readFileSync } from "fs";
import https from "https";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userRouter } from "./src/routes/routes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import cors from "cors";
import cookieParser from 'cookie-parser';

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
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}));

app.use(
	express.static(path.resolve("/home/thunman/frontEnd/PortfolioSite/build"))
);
app.get("*", (req, res) => {
	res.sendFile(
		path.resolve("/home/thunman/frontEnd/PortfolioSite/build", "index.html")
	);
});
app.set('trust proxy', 1);
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
