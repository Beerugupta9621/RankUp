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


    const token =
        localStorage.getItem("accessToken");


    useEffect(() => {

        if (!token) {
            navigate("/login");
            return;
        }

        fetchPosts();

    }, []);


    const fetchPosts = async () => {

        try {

            const response = await api.get(
                "/community",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setPosts(
                response.data.posts || []
            );

        } catch (error) {

            console.error(
                "Community error:",
                error
            );

            setError(
                "Failed to load community posts"
            );

        } finally {

            setLoading(false);

        }

    };


    const handleCreatePost = async (e) => {

        e.preventDefault();

        if (!title.trim() || !content.trim()) {

            setError(
                "Title and content are required"
            );

            return;
        }


        setCreating(true);
        setError("");


        try {

            const tagList =
                tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);


            const response = await api.post(
                "/community",
                {
                    title: title.trim(),
                    content: content.trim(),
                    tags: tagList
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
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
                "Failed to create post"
            );

        } finally {

            setCreating(false);

        }

    };


    const handleLike = async (postId) => {

        try {

            const response = await api.put(
                `/community/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setPosts((previousPosts) =>
                previousPosts.map((post) => {

                    if (post._id !== postId) {
                        return post;
                    }


                    const currentUser =
                        JSON.parse(
                            localStorage.getItem(
                                "user"
                            ) || "{}"
                        );


                    let likes =
                        post.likes || [];


                    if (response.data.liked) {

                        likes = [
                            ...likes,
                            currentUser.id
                        ];

                    } else {

                        likes =
                            likes.filter(
                                (id) =>
                                    id !== currentUser.id
                            );

                    }


                    return {
                        ...post,
                        likes
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


    const handleDelete = async (postId) => {

        const confirmed =
            window.confirm(
                "Delete this post?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/community/${postId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setPosts((previousPosts) =>
                previousPosts.filter(
                    (post) =>
                        post._id !== postId
                )
            );


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

        }

    };


    const currentUser =
        JSON.parse(
            localStorage.getItem("user") || "{}"
        );


    if (loading) {

        return (
            <div className="community-loading">
                Loading Community...
            </div>
        );

    }


    return (

        <div className="community-page">


            {/* NAVBAR */}

            <nav className="community-nav">

                <div className="community-nav-inner">

                    <div
                        className="community-logo"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >

                        <div className="community-logo-icon">
                            R
                        </div>

                        <span>
                            RankUp
                        </span>

                    </div>


                    <button
                        className="community-back"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

            </nav>



            {/* MAIN */}

            <main className="community-main">


                {/* HEADER */}

                <section className="community-hero">

                    <div className="community-label">
                        RANKUP COMMUNITY
                    </div>

                    <h1>
                        Discuss. Share.{" "}
                        <span>Improve.</span>
                    </h1>

                    <p>
                        Share ideas, discuss problems,
                        exchange competitive programming
                        strategies and learn together.
                    </p>

                </section>



                {/* CREATE POST */}

                <section className="create-post-card">

                    <h2>
                        Start a Discussion
                    </h2>

                    <form
                        onSubmit={
                            handleCreatePost
                        }
                    >

                        <input
                            type="text"
                            placeholder="Discussion title"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            maxLength={150}
                        />


                        <textarea
                            placeholder="What do you want to discuss?"
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            rows={5}
                            maxLength={5000}
                        />


                        <input
                            type="text"
                            placeholder="Tags (comma separated)"
                            value={tags}
                            onChange={(e) =>
                                setTags(
                                    e.target.value
                                )
                            }
                        />


                        {error && (
                            <div className="community-error">
                                {error}
                            </div>
                        )}


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



                {/* FEED */}

                <section className="community-feed">

                    <div className="feed-header">

                        <h2>
                            Community Discussions
                        </h2>

                        <span>
                            {posts.length} posts
                        </span>

                    </div>


                    {posts.length === 0 ? (

                        <div className="empty-community">
                            No discussions yet. Be the first
                            to start one!
                        </div>

                    ) : (

                        posts.map((post) => {

                            const liked =
                                (post.likes || [])
                                    .some(
                                        (id) =>
                                            id ===
                                            currentUser.id
                                    );


                            const isOwner =
                                post.author?._id ===
                                currentUser.id;


                            return (

                                <article
                                    className="community-post"
                                    key={post._id}
                                >

                                    <div className="post-top">

                                        <div className="post-author">

                                            <div className="post-avatar">
                                                {post.author?.username
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "U"}
                                            </div>

                                            <div>

                                                <strong>
                                                    {post.author?.username ||
                                                        "Unknown User"}
                                                </strong>

                                                <span>
                                                    {new Date(
                                                        post.createdAt
                                                    ).toLocaleString()}
                                                </span>

                                            </div>

                                        </div>


                                        {isOwner && (

                                            <button
                                                className="delete-post"
                                                onClick={() =>
                                                    handleDelete(
                                                        post._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        )}

                                    </div>


                                    <h3>
                                        {post.title}
                                    </h3>


                                    <p className="post-content">
                                        {post.content}
                                    </p>


                                    {post.tags?.length > 0 && (

                                        <div className="post-tags">

                                            {post.tags.map(
                                                (tag, index) => (

                                                    <span
                                                        key={index}
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
                                                liked
                                                    ? "like-button liked"
                                                    : "like-button"
                                            }
                                            onClick={() =>
                                                handleLike(
                                                    post._id
                                                )
                                            }
                                        >

                                            {liked
                                                ? "♥"
                                                : "♡"}

                                            {" "}

                                            {post.likes?.length ||
                                                0}

                                        </button>

                                    </div>

                                </article>

                            );

                        })

                    )}

                </section>


            </main>

        </div>

    );

}


export default Community;