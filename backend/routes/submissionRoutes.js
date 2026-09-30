const express = require("express");

const protect = require("../middleware/authMiddleware");
const Submission = require("../models/Submission");
const { runCode } = require("../services/judgeService");

const router = express.Router();


// RUN CODE
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


// SUBMIT CODE
router.post("/submit", protect, async (req, res) => {
    try {

        const {
            problemId,
            sourceCode,
            languageId,
            language,
            stdin
        } = req.body;


        if (!problemId) {
            return res.status(400).json({
                message: "Problem ID is required"
            });
        }


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


        const submission =
            await Submission.create({

                user: req.user.id,

                problem: problemId,

                sourceCode: sourceCode,

                language: language || "cpp",

                languageId: languageId,

                stdin: stdin || "",

                stdout: result.stdout || "",

                stderr: result.stderr || "",

                compileOutput:
                    result.compile_output || "",

                status:
                    result.status?.description ||
                    "Unknown",

                executionTime:
                    result.time || "",

                memory:
                    result.memory || 0
            });


        res.status(201).json({

            message:
                "Submission created successfully",

            submission

        });


    } catch (error) {

        console.error(
            "Submission error:",
            error.message
        );

        res.status(500).json({

            message:
                "Submission failed"

        });

    }
});


module.exports = router;