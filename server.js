import express from "express";
import { readFileSync } from "fs";
import https from "https";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./src/routes/routes";

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

app.use(express.json());
app.use("/api/users", userRouter);

const stopServer = () => {
    return new Promise((resolve, reject) => {
      mongoose.connection.close()
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
  }

const startServer = async () => {
	try {
		await mongoose.connect(mongoUrl);
		server.listen(port, (error) => {
			if (error) console.error(error);
		});
		return app;
	} catch (error) {
	}
};

startServer();

export { startServer, stopServer };
