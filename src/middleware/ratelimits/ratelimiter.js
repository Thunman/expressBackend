import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: function(req, res) {
      res.status(429).json({ message: 'Too many requests, please try again later.' });
    }
  });