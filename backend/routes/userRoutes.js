const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/test-user", async (req, res) => {
    try {
        const user = await User.create({
            username: "testuser",
            email: "test@rankup.com",
            password: "temporary-password"
        });

        res.status(201).json({
            message: "Test user created",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create test user",
            error: error.message
        });
    }
});

module.exports = router;