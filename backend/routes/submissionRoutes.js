const express = require("express");

const protect = require("../middleware/authMiddleware");
const { runCode } = require("../services/judgeService");

const router = express.Router();

router.post("/run", protect, async (req, res) => {
    try {
        const {
            sourceCode,
            languageId,
            stdin
        } = req.body;

        if (!sourceCode) {
            return res.status(400).json({
                message: "Source code is required"
            });
        }

        if (!languageId) {
            return res.status(400).json({
                message: "Language ID is required"
            });
        }

        const result = await runCode(
            sourceCode,
            languageId,
            stdin || ""
        );

        res.status(200).json({
            message: "Code executed successfully",
            result
        });

    } catch (error) {
        console.error(
            "Run code error:",
            error.message
        );

        res.status(500).json({
            message: "Code execution failed"
        });
    }
});

module.exports = router;