const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const { getCodeforcesProfile } = require("../services/codeforcesService");
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

/* LINK CODEFORCES PROFILE */
router.put("/codeforces", protect, async (req, res) => {
    try {
        const { handle } = req.body;

        if (!handle || !handle.trim()) {
            return res.status(400).json({
                message: "Codeforces handle is required"
            });
        }

        const profile = await getCodeforcesProfile(
            handle.trim()
        );

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                codeforcesHandle: profile.handle,
                codeforcesRating: profile.rating
            },
            {
                new: true
            }
        ).select("-password");

        res.status(200).json({
            message: "Codeforces profile linked successfully",
            profile,
            user
        });

    } catch (error) {
        console.error(
            "Codeforces linking error:",
            error.message
        );

        res.status(400).json({
            message: error.message
        });
    }
});
module.exports = router;







