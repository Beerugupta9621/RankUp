const express = require("express");

const Post = require("../models/Post");
const Comment = require("../models/Comment");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


/* GET ALL POSTS */

router.get("/", protect, async (req, res) => {

    try {

        const posts = await Post.find()
            .populate(
                "author",
                "username avatar"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            posts
        });

    } catch (error) {

        console.error(
            "Get community posts error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while fetching posts"
        });

    }

});


/* CREATE POST */

router.post("/", protect, async (req, res) => {

    try {

        const {
            title,
            content,
            tags
        } = req.body;


        if (!title || !content) {

            return res.status(400).json({
                message:
                    "Title and content are required"
            });

        }


        const post = await Post.create({

            author: req.user.id,

            title: title.trim(),

            content: content.trim(),

            tags: Array.isArray(tags)
                ? tags
                : []

        });


        const populatedPost =
            await Post.findById(post._id)
                .populate(
                    "author",
                    "username avatar"
                );


        res.status(201).json({

            message:
                "Post created successfully",

            post: populatedPost

        });

    } catch (error) {

        console.error(
            "Create post error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while creating post"
        });

    }

});


/* LIKE / UNLIKE POST */

router.put("/:id/like", protect, async (req, res) => {

    try {

        const post =
            await Post.findById(req.params.id);


        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        const userId =
            req.user.id.toString();


        const alreadyLiked =
            post.likes.some(
                (id) =>
                    id.toString() === userId
            );


        if (alreadyLiked) {

            post.likes =
                post.likes.filter(
                    (id) =>
                        id.toString() !== userId
                );

        } else {

            post.likes.push(
                req.user.id
            );

        }


        await post.save();


        res.status(200).json({

            message: alreadyLiked
                ? "Post unliked"
                : "Post liked",

            likes: post.likes.length,

            liked: !alreadyLiked

        });

    } catch (error) {

        console.error(
            "Like post error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while liking post"
        });

    }

});


/* GET COMMENTS FOR POST */

router.get(
    "/:id/comments",
    protect,
    async (req, res) => {

        try {

            const post =
                await Post.findById(req.params.id);


            if (!post) {

                return res.status(404).json({
                    message: "Post not found"
                });

            }


            const comments =
                await Comment.find({
                    post: req.params.id
                })
                .populate(
                    "author",
                    "username avatar"
                )
                .sort({
                    createdAt: 1
                });


            res.status(200).json({
                comments
            });

        } catch (error) {

            console.error(
                "Get comments error:",
                error.message
            );

            res.status(500).json({
                message:
                    "Server error while fetching comments"
            });

        }

    }
);


/* CREATE COMMENT */

router.post(
    "/:id/comments",
    protect,
    async (req, res) => {

        try {

            const {
                content
            } = req.body;


            if (
                !content ||
                !content.trim()
            ) {

                return res.status(400).json({
                    message:
                        "Comment content is required"
                });

            }


            const post =
                await Post.findById(req.params.id);


            if (!post) {

                return res.status(404).json({
                    message: "Post not found"
                });

            }


            const comment =
                await Comment.create({

                    post: post._id,

                    author: req.user.id,

                    content:
                        content.trim()

                });


            const populatedComment =
                await Comment.findById(
                    comment._id
                )
                .populate(
                    "author",
                    "username avatar"
                );


            res.status(201).json({

                message:
                    "Comment added successfully",

                comment:
                    populatedComment

            });

        } catch (error) {

            console.error(
                "Create comment error:",
                error.message
            );

            res.status(500).json({
                message:
                    "Server error while creating comment"
            });

        }

    }
);


/* DELETE OWN COMMENT */

router.delete(
    "/comments/:id",
    protect,
    async (req, res) => {

        try {

            const comment =
                await Comment.findById(
                    req.params.id
                );


            if (!comment) {

                return res.status(404).json({
                    message: "Comment not found"
                });

            }


            if (
                comment.author.toString() !==
                req.user.id.toString()
            ) {

                return res.status(403).json({
                    message:
                        "You can only delete your own comments"
                });

            }


            await Comment.findByIdAndDelete(
                req.params.id
            );


            res.status(200).json({

                message:
                    "Comment deleted successfully"

            });

        } catch (error) {

            console.error(
                "Delete comment error:",
                error.message
            );

            res.status(500).json({
                message:
                    "Server error while deleting comment"
            });

        }

    }
);


/* DELETE OWN POST */

router.delete("/:id", protect, async (req, res) => {

    try {

        const post =
            await Post.findById(req.params.id);


        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        if (
            post.author.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({
                message:
                    "You can only delete your own posts"
            });

        }


        /* DELETE COMMENTS WITH POST */

        await Comment.deleteMany({
            post: req.params.id
        });


        await Post.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            message:
                "Post deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete post error:",
            error.message
        );

        res.status(500).json({
            message:
                "Server error while deleting post"
        });

    }

});


module.exports = router;