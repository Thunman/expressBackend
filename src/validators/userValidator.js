import { body } from "express-validator";

export const registerValidators = [
	body("userName").trim().isLength({ min: 1 }).escape(),
	body("email").isEmail().normalizeEmail(),
	body("password")
		.isLength({ min: 8 })
		.matches(/[a-z]/)
		.matches(/[A-Z]/)
		.matches(/\d/)
		.withMessage(
			"Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter and one digit"
		),
];

export const loginValidators = [
	body("email").isEmail().normalizeEmail(),
	body("password").isLength({ min: 8 }),
];
