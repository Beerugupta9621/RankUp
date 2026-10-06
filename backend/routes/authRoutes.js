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

/* LEADERBOARD */

router.get("/leaderboard", protect, async (req, res) => {

    try {

        const users = await User.find()
            .select(
                "username eloRating problemsSolved codeforcesRating codeforcesHandle"
            )
            .sort({
                eloRating: -1,
                problemsSolved: -1,
                codeforcesRating: -1
            })
            .limit(50);

        const leaderboard = users.map(
            (user, index) => ({
                rank: index + 1,
                username: user.username,
                eloRating: user.eloRating ?? 1000,
                problemsSolved: user.problemsSolved ?? 0,
                codeforcesRating:
                    user.codeforcesRating ?? 0,
                codeforcesHandle:
                    user.codeforcesHandle || ""
            })
        );

        res.status(200).json({
            leaderboard
        });

    } catch (error) {

        console.error(
            "Leaderboard error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching leaderboard"
        });

    }

});

/* GET CODEFORCES CONTESTS */

router.get(
    "/codeforces/contests",
    protect,
    async (req, res) => {

        try {

            const response =
                await fetch(
                    "https://codeforces.com/api/contest.list"
                );

            const data =
                await response.json();


            if (data.status !== "OK") {

                return res.status(500).json({
                    message:
                        "Unable to fetch Codeforces contests"
                });

            }


            const upcomingContests =
                data.result
                    .filter(
                        (contest) =>
                            contest.phase === "BEFORE"
                    )
                    .sort(
                        (a, b) =>
                            a.startTimeSeconds -
                            b.startTimeSeconds
                    )
                    .slice(0, 10);


            res.status(200).json({
                contests:
                    upcomingContests
            });

        } catch (error) {

            console.error(
                "Codeforces contest error:",
                error.message
            );

            res.status(500).json({
                message:
                    "Server error while fetching contests"
            });

        }

    }
);
module.exports = router;







