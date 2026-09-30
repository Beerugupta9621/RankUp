const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        sourceCode: {
            type: String,
            required: true
        },

        language: {
            type: String,
            required: true,
            default: "cpp"
        },

        languageId: {
            type: Number,
            required: true
        },

        stdin: {
            type: String,
            default: ""
        },

        stdout: {
            type: String,
            default: ""
        },

        stderr: {
            type: String,
            default: ""
        },

        compileOutput: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "Pending"
        },

        executionTime: {
            type: String,
            default: ""
        },

        memory: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Submission",
    submissionSchema
);