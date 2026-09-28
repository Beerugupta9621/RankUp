const express = require("express");

const Problem = require("../models/Problem");
const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Get all published problems
router.get("/", protect, async (req, res) => {
    try {
        const problems = await Problem.find({
            isPublished: true
        }).select(
            "title difficulty tags createdAt"
        );

        res.status(200).json({
            problems
        });

    } catch (error) {
        console.error(
            "Get problems error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching problems"
        });
    }
});


// Get single problem
router.get("/:id", protect, async (req, res) => {
    try {
        const problem = await Problem.findById(
            req.params.id
        );

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        res.status(200).json({
            problem
        });

    } catch (error) {
        console.error(
            "Get problem error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while fetching problem"
        });
    }
});


// Create problem
router.post("/", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            tags,
            constraints,
            examples,
            starterCode,
            testCases
        } = req.body;

        if (
            !title ||
            !description ||
            !difficulty
        ) {
            return res.status(400).json({
                message:
                    "Title, description and difficulty are required"
            });
        }

        const problem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            constraints,
            examples,
            starterCode,
            testCases,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Problem created successfully",
            problem
        });

    } catch (error) {
        console.error(
            "Create problem error:",
            error.message
        );

        res.status(500).json({
            message: "Server error while creating problem"
        });
    }
});


module.exports = router;