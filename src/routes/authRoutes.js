import express from "express";

const router = express.Router();

/**
 * TEMP REGISTER (working basic version)
 * Later we will connect database + bcrypt
 */
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  // fake success response for now
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      email
    }
  });
});

export default router;
