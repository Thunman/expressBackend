import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
	const token = req.cookies.token
	if (!token) return res.status(401).json({ message: "No token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: "Token expired" });
		}
		res.status(400).json({ message: "Invalid Token" });
	}
};
