const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();


/* REGISTER */
router.post("/register", registerUser);


/* LOGIN */
router.post("/login", loginUser);


/* GET CURRENT USER */
router.get("/me", protect, async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Authenticated user",
            user
        });

    } catch (error) {

        console.error(
            "Get profile error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching profile"
        });
    }
});


module.exports = router;