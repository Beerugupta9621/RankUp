const express = require("express");

const protect = require("../middleware/authMiddleware");
const Submission = require("../models/Submission");
const User = require("../models/User");
const Problem = require("../models/Problem");
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
            language
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

        const problem =
            await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        if (
            !problem.testCases ||
            problem.testCases.length === 0
        ) {
            return res.status(400).json({
                message: "This problem has no test cases"
            });
        }

        let finalStatus = "Accepted";

        let finalStdout = "";
        let finalStderr = "";
        let finalCompileOutput = "";
        let finalTime = "";
        let finalMemory = 0;

        for (const testCase of problem.testCases) {

            console.log(
                "Testing input:",
                testCase.input
            );

            console.log(
                "Expected output:",
                testCase.output
            );

            const result = await runCode(
                sourceCode,
                languageId,
                testCase.input || ""
            );

            finalStdout =
                result.stdout || "";

            finalStderr =
                result.stderr || "";

            finalCompileOutput =
                result.compile_output || "";

            finalTime =
                result.time || "";

            finalMemory =
                result.memory || 0;

            console.log(
                "Judge output:",
                result.stdout
            );

            if (result.compile_output) {

                finalStatus =
                    "Compilation Error";

                break;
            }

            if (result.stderr) {

                finalStatus =
                    "Runtime Error";

                break;
            }

            const actual =
                (result.stdout || "")
                    .trim()
                    .split(/\s+/)
                    .join(" ");

            const expected =
                (testCase.output || "")
                    .trim()
                    .split(/\s+/)
                    .join(" ");

            console.log(
                "Actual:",
                actual
            );

            console.log(
                "Expected:",
                expected
            );

            if (actual !== expected) {

                finalStatus =
                    "Wrong Answer";

                break;
            }
        }

        const submission =
            await Submission.create({

                user: req.user.id,

                problem: problemId,

                sourceCode: sourceCode,

                language:
                    language || "cpp",

                languageId: languageId,

                stdout: finalStdout,

                stderr: finalStderr,

                compileOutput:
                    finalCompileOutput,

                status: finalStatus,

                executionTime:
                    finalTime,

                memory:
                    finalMemory
            });

        if (finalStatus === "Accepted") {

            const previousAccepted =
                await Submission.findOne({
                    user: req.user.id,
                    problem: problemId,
                    status: "Accepted",
                    _id: {
                        $ne: submission._id
                    }
                });

            if (!previousAccepted) {

                await User.findByIdAndUpdate(
                    req.user.id,
                    {
                        $inc: {
                            problemsSolved: 1
                        }
                    }
                );
            }
        }

        res.status(201).json({
            message:
                "Submission evaluated successfully",
            submission
        });

    } catch (error) {

        console.error(
            "Submission error:",
            error.message
        );

        res.status(500).json({
            message: "Submission failed"
        });
    }
});
// GET SUBMISSION HISTORY
router.get("/history", protect, async (req, res) => {
    try {
        const submissions = await Submission.find({
            user: req.user.id
        })
            .populate("problem", "title difficulty")
            .select(
                "problem language status executionTime memory createdAt sourceCode"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            submissions
        });

    } catch (error) {

        console.error(
            "Submission history error:",
            error.message
        );

        res.status(500).json({
            message:
                "Failed to fetch submission history"
        });
    }
});

// GET SINGLE SUBMISSION
router.get("/:id", protect, async (req, res) => {
    try {

        const submission =
            await Submission.findOne({
                _id: req.params.id,
                user: req.user.id
            }).populate(
                "problem",
                "title difficulty"
            );

        if (!submission) {

            return res.status(404).json({
                message: "Submission not found"
            });

        }

        res.status(200).json({
            submission
        });

    } catch (error) {

        console.error(
            "Submission details error:",
            error.message
        );

        res.status(500).json({
            message:
                "Failed to fetch submission details"
        });
    }
});
module.exports = router;