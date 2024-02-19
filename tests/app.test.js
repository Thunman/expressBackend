import request from "supertest";
import { startServer, stopServer } from "../server";
import { User } from "../src/models/models";
import bcrypt from "bcrypt";

let app;

beforeAll(async () => {
	app = await startServer();
});

afterAll(async () => {
	await stopServer();
});

jest.mock("../src/models/models");

describe("userController", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("register", () => {
		it("should create a new user", async () => {
			const userData = {
				userName: "testUser",
				email: "test@example.com",
				password: "Password123",
			};

			User.findOne.mockResolvedValue(null);
			User.prototype.save.mockResolvedValue();

			const response = await request(app)
				.post("/api/users/register") 
				.send(userData);

			expect(response.status).toBe(201);
			expect(response.body).toEqual({ message: "User Created" });
		});

		it("should return 400 if user already exists", async () => {
			const userData = {
				userName: "testUser",
				email: "test@example.com",
				password: "Password123",
			};

			User.findOne.mockResolvedValue(userData);

			const response = await request(app)
				.post("/api/users/register") 
				.send(userData);

			expect(response.status).toBe(400);
			expect(response.body).toEqual({ message: "User already exists" });
		});
	});

	describe("login", () => {
		it("should login a user", async () => {
			const userData = {
				email: "test@example.com",
				password: "Password123",
			};

			const hashedPassword = await bcrypt.hash(userData.password, 10);
			User.findOne.mockResolvedValue({
				...userData,
				password: hashedPassword,
			});

			const response = await request(app)
				.post("/api/users/login") 
				.send(userData);

			expect(response.status).toBe(200);
			expect(response.body.message).toEqual("Welcome");
			expect(response.body).toHaveProperty("token");
		});

		it("should return 401 for invalid credentials", async () => {
			const userData = {
				email: "test@example.com",
				password: "Password123",
			};

			User.findOne.mockResolvedValue(null);

			const response = await request(app)
				.post("/api/users/login") 
				.send(userData);

			expect(response.status).toBe(401);
			expect(response.body).toEqual({
				message: "Invalid Email or Password",
			});
		});
	});
});
