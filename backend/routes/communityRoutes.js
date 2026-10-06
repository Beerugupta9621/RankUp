const express = require("express");

const Post = require("../models/Post");
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
            message: "Server error while fetching posts"
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