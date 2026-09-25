const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                eloRating: user.eloRating
            }
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};

module.exports = {
    registerUser
};