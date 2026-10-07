import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Community.css";

function Community() {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");

    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const [comments, setComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [commentLoading, setCommentLoading] = useState({});
    const [commentCreating, setCommentCreating] = useState({});


    /* GET TOKEN */

    const getAuthConfig = () => {

        const token =
            localStorage.getItem("accessToken");

        if (!token) {

            navigate("/login");

            return null;

        }

        return {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        };

    };


    const currentUser =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );


    /* FETCH POSTS */

    useEffect(() => {

        const fetchPosts = async () => {

            try {

                const config =
                    getAuthConfig();

                if (!config) {
                    return;
                }

                const response =
                    await api.get(
                        "/community",
                        config
                    );

                setPosts(
                    response.data.posts || []
                );

            } catch (error) {

                console.error(
                    "Community fetch error:",
                    error
                );

                console.error(
                    "Response:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load community posts."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchPosts();

    }, []);


    /* CREATE POST */

    const handleCreatePost = async (event) => {

        event.preventDefault();

        if (!title.trim() || !content.trim()) {

            setError(
                "Title and content are required."
            );

            return;

        }

        try {

            setCreating(true);
            setError("");

            const config =
                getAuthConfig();

            if (!config) {
                return;
            }

            const response =
                await api.post(
                    "/community",
                    {
                        title: title.trim(),
                        content: content.trim(),
                        tags: tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                    },
                    config
                );

            setPosts((previousPosts) => [
                response.data.post,
                ...previousPosts
            ]);

            setTitle("");
            setContent("");
            setTags("");

        } catch (error) {

            console.error(
                "Create post error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to create post."
            );

        } finally {

            setCreating(false);

        }

    };


    /* LIKE / UNLIKE */

    const handleLike = async (postId) => {

        try {

            const config =
                getAuthConfig();

            if (!config) {
                return;
            }

            const response =
                await api.put(
                    `/community/${postId}/like`,
                    {},
                    config
                );

            setPosts((previousPosts) =>
                previousPosts.map((post) => {

                    if (post._id !== postId) {
                        return post;
                    }

                    const currentLikes =
                        post.likes || [];

                    if (response.data.liked) {

                        return {
                            ...post,
                            likes: [
                                ...currentLikes,
                                currentUser?.id
                            ]
                        };

                    }

                    return {
                        ...post,
                        likes: currentLikes.filter(
                            (id) =>
                                id !== currentUser?.id
                        )
                    };

                })
            );

        } catch (error) {

            console.error(
                "Like error:",
                error
            );

        }

    };


    /* DELETE POST */

    const handleDeletePost = async (postId) => {

        const confirmed =
            window.confirm(
                "Delete this post?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const config =
                getAuthConfig();

            if (!config) {
                return;
            }

            await api.delete(
                `/community/${postId}`,
                config
            );

            setPosts((previousPosts) =>
                previousPosts.filter(
                    (post) =>
                        post._id !== postId
                )
            );

            setComments((previous) => {

                const updated = {
                    ...previous
                };

                delete updated[postId];

                return updated;

            });

        } catch (error) {

            console.error(
                "Delete post error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete post."
            );

        }

    };


    /* LOAD COMMENTS */

    const loadComments = async (postId) => {

        try {

            const config =
                getAuthConfig();

            if (!config) {
                return;
            }

            setCommentLoading((previous) => ({
                ...previous,
                [postId]: true
            }));

            const response =
                await api.get(
                    `/community/${postId}/comments`,
                    config
                );

            setComments((previous) => ({
                ...previous,
                [postId]:
                    response.data.comments || []
            }));

        } catch (error) {

            console.error(
                "Load comments error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load comments."
            );

        } finally {

            setCommentLoading((previous) => ({
                ...previous,
                [postId]: false
            }));

        }

    };


    /* COMMENT INPUT */

    const handleCommentInput = (
        postId,
        value
    ) => {

        setCommentInputs((previous) => ({
            ...previous,
            [postId]: value
        }));

    };


    /* ADD COMMENT */

    const handleAddComment = async (postId) => {

        const commentText =
            commentInputs[postId]?.trim();

        if (!commentText) {
            return;
        }

        try {

            const config =
                getAuthConfig();

            if (!config) {
                return;
            }

            setCommentCreating((previous) => ({
                ...previous,
                [postId]: true
            }));

            const response =
                await api.post(
                    `/community/${postId}/comments`,
                    {
                        content: commentText
                    },
                    config
                );

            setComments((previous) => ({
                ...previous,
                [postId]: [
                    ...(previous[postId] || []),
                    response.data.comment
                ]
            }));

            setCommentInputs((previous) => ({
                ...previous,
                [postId]: ""
            }));

        } catch (error) {

            console.error(
                "Add comment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to add comment."
            );

        } finally {

            setCommentCreating((previous) => ({
                ...previous,
                [postId]: false
            }));

        }

    };


    /* DELETE COMMENT */

    const handleDeleteComment = async (
        postId,
        commentId
    ) => {

        const confirmed =
            window.confirm(
                "Delete this comment?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const config =
                getAuthConfig();

            if (!config) {
                return;
            }

            await api.delete(
                `/community/comments/${commentId}`,
                config
            );

            setComments((previous) => ({
                ...previous,
                [postId]:
                    (previous[postId] || []).filter(
                        (comment) =>
                            comment._id !== commentId
                    )
            }));

        } catch (error) {

            console.error(
                "Delete comment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete comment."
            );

        }

    };


    /* CHECK LIKE */

    const isLiked = (post) => {

        if (!currentUser || !post.likes) {
            return false;
        }

        return post.likes.some(
            (id) =>
                id === currentUser.id ||
                id?._id === currentUser.id
        );

    };


    return (

        <div className="community-page">

            <nav className="community-navbar">

                <div
                    className="community-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Rank<span>Up</span>
                </div>

                <button
                    className="community-back"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </nav>


            <section className="community-hero">

                <p className="community-label">
                    COMMUNITY HUB
                </p>

                <h1>
                    Discuss. Share. Improve.
                </h1>

                <p>
                    Connect with competitive
                    programmers, share ideas and
                    discuss problems.
                </p>

            </section>


            <main className="community-container">

                {/* CREATE POST */}

                <section className="create-post-card">

                    <div className="section-heading">

                        <div>

                            <p className="community-label">
                                START A DISCUSSION
                            </p>

                            <h2>
                                Create a Post
                            </h2>

                        </div>

                    </div>


                    <form
                        onSubmit={handleCreatePost}
                        className="create-post-form"
                    >

                        <input
                            type="text"
                            placeholder="Discussion title"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                        />

                        <textarea
                            placeholder="Share your thoughts, solution, or question..."
                            value={content}
                            onChange={(event) =>
                                setContent(
                                    event.target.value
                                )
                            }
                            rows="5"
                        />

                        <input
                            type="text"
                            placeholder="Tags (example: dp, graphs, c++)"
                            value={tags}
                            onChange={(event) =>
                                setTags(
                                    event.target.value
                                )
                            }
                        />

                        <button
                            type="submit"
                            disabled={creating}
                        >
                            {creating
                                ? "Publishing..."
                                : "Publish Discussion"}
                        </button>

                    </form>

                </section>


                {error && (

                    <div className="community-error">

                        {error}

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                <section className="community-feed">

                    <div className="feed-header">

                        <div>

                            <p className="community-label">
                                LATEST DISCUSSIONS
                            </p>

                            <h2>
                                Community Feed
                            </h2>

                        </div>

                        <span>
                            {posts.length} posts
                        </span>

                    </div>


                    {loading && (

                        <div className="community-state">

                            <div className="loader"></div>

                            <p>
                                Loading discussions...
                            </p>

                        </div>

                    )}


                    {!loading &&
                        posts.length === 0 && (

                            <div className="community-state">

                                <h3>
                                    No discussions yet
                                </h3>

                                <p>
                                    Be the first to start
                                    a conversation.
                                </p>

                            </div>

                        )}


                    {!loading &&
                        posts.map((post) => {

                            const postComments =
                                comments[post._id] || [];

                            return (

                                <article
                                    className="community-post"
                                    key={post._id}
                                >

                                    <div className="post-author">

                                        <div className="author-avatar">

                                            {post.author?.username
                                                ?.charAt(0)
                                                ?.toUpperCase()}

                                        </div>

                                        <div>

                                            <strong>
                                                {post.author?.username ||
                                                    "Unknown user"}
                                            </strong>

                                            <span>
                                                {new Date(
                                                    post.createdAt
                                                ).toLocaleString()}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="post-content">

                                        <h3>
                                            {post.title}
                                        </h3>

                                        <p>
                                            {post.content}
                                        </p>

                                    </div>


                                    {post.tags?.length > 0 && (

                                        <div className="post-tags">

                                            {post.tags.map(
                                                (tag, index) => (

                                                    <span
                                                        key={`${post._id}-${index}`}
                                                    >
                                                        #{tag}
                                                    </span>

                                                )
                                            )}

                                        </div>

                                    )}


                                    <div className="post-actions">

                                        <button
                                            className={
                                                isLiked(post)
                                                    ? "liked"
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleLike(
                                                    post._id
                                                )
                                            }
                                        >
                                            {isLiked(post)
                                                ? "♥"
                                                : "♡"}{" "}
                                            {post.likes?.length || 0}
                                        </button>


                                        <button
                                            onClick={() =>
                                                loadComments(
                                                    post._id
                                                )
                                            }
                                        >
                                            💬 Comments
                                        </button>


                                        {currentUser &&
                                            post.author?._id ===
                                                currentUser.id && (

                                                <button
                                                    className="delete-post"
                                                    onClick={() =>
                                                        handleDeletePost(
                                                            post._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            )}

                                    </div>


                                    <div className="comments-section">

                                        <div className="comment-input-row">

                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={
                                                    commentInputs[
                                                        post._id
                                                    ] || ""
                                                }
                                                onChange={(event) =>
                                                    handleCommentInput(
                                                        post._id,
                                                        event.target.value
                                                    )
                                                }
                                                onKeyDown={(event) => {

                                                    if (
                                                        event.key ===
                                                        "Enter"
                                                    ) {

                                                        handleAddComment(
                                                            post._id
                                                        );

                                                    }

                                                }}
                                            />

                                            <button
                                                onClick={() =>
                                                    handleAddComment(
                                                        post._id
                                                    )
                                                }
                                                disabled={
                                                    commentCreating[
                                                        post._id
                                                    ]
                                                }
                                            >
                                                {commentCreating[
                                                    post._id
                                                ]
                                                    ? "..."
                                                    : "Post"}
                                            </button>

                                        </div>


                                        {commentLoading[
                                            post._id
                                        ] && (

                                            <p className="comments-loading">
                                                Loading comments...
                                            </p>

                                        )}


                                        {!commentLoading[
                                            post._id
                                        ] &&
                                            postComments.map(
                                                (comment) => (

                                                    <div
                                                        className="comment"
                                                        key={
                                                            comment._id
                                                        }
                                                    >

                                                        <div className="comment-avatar">
                                                            {comment.author?.username
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}
                                                        </div>

                                                        <div className="comment-body">

                                                            <div className="comment-header">

                                                                <strong>
                                                                    {
                                                                        comment
                                                                            .author
                                                                            ?.username
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {new Date(
                                                                        comment.createdAt
                                                                    ).toLocaleString()}
                                                                </span>

                                                            </div>

                                                            <p>
                                                                {
                                                                    comment.content
                                                                }
                                                            </p>

                                                        </div>


                                                        {currentUser &&
                                                            comment.author?._id ===
                                                                currentUser.id && (

                                                                <button
                                                                    className="delete-comment"
                                                                    onClick={() =>
                                                                        handleDeleteComment(
                                                                            post._id,
                                                                            comment._id
                                                                        )
                                                                    }
                                                                >
                                                                    ×
                                                                </button>

                                                            )}

                                                    </div>

                                                )
                                            )}

                                    </div>

                                </article>

                            );

                        })}

                </section>

            </main>

        </div>

    );

}

export default Community;