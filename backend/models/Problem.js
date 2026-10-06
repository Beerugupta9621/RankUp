const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },

        tags: {
            type: [String],
            default: []
        },

        constraints: {
            type: [String],
            default: []
        },

        examples: [
            {
                input: {
                    type: String
                },

                output: {
                    type: String
                },

                explanation: {
                    type: String
                }
            }
        ],

        starterCode: {
            cpp: {
                type: String,
                default: ""
            },

            java: {
                type: String,
                default: ""
            },

            python: {
                type: String,
                default: ""
            },

            javascript: {
                type: String,
                default: ""
            }
        },

        testCases: [
            {
                input: {
                    type: String,
                    required: true
                },

                output: {
                    type: String,
                    required: true
                }
            }
        ],

        /* WING EDITORIAL */

        hint1: {
            type: String,
            default: ""
        },

        hint2: {
            type: String,
            default: ""
        },

        hint3: {
            type: String,
            default: ""
        },

        editorial: {
            type: String,
            default: ""
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        isPublished: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Problem", problemSchema);