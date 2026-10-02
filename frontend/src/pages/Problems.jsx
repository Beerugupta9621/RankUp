import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./Problems.css";

function Problems() {
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");
    const [tag, setTag] = useState("All");

    const [solvedProblems, setSolvedProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                /* GET ALL PROBLEMS */

                const response = await api.get(
                    "/problems",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setProblems(
                    response.data.problems || []
                );


                /* GET SOLVED PROBLEMS */

                const solvedResponse = await api.get(
                    "/submissions/solved",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setSolvedProblems(
                    solvedResponse.data.solvedProblems || []
                );

            } catch (error) {
                console.error(
                    "Problems error:",
                    error
                );

                if (
                    error.response?.status === 401
                ) {
                    localStorage.removeItem(
                        "accessToken"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    navigate("/login");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchProblems();

    }, [navigate]);


    /* GET UNIQUE TAGS FROM ALL PROBLEMS */

    const allTags = [
        ...new Set(
            problems.flatMap(
                (problem) =>
                    problem.tags || []
            )
        )
    ];


    /* SEARCH + DIFFICULTY + TAG FILTER */

    const filteredProblems =
        problems.filter((problem) => {

            const matchesSearch =
                problem.title
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );

            const matchesDifficulty =
                difficulty === "All" ||
                problem.difficulty === difficulty;

            const matchesTag =
                tag === "All" ||
                problem.tags?.includes(tag);

            return (
                matchesSearch &&
                matchesDifficulty &&
                matchesTag
            );
        });


    return (
        <div className="problems-page">

            {/* NAVBAR */}

            <nav className="problems-nav">

                <div
                    className="problems-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >

                    <div className="problems-logo-icon">
                        R
                    </div>

                    <span>
                        RankUp
                    </span>

                </div>


                <button
                    className="problems-back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </nav>


            <main className="problems-main">

                {/* HEADER */}

                <div className="problems-header">

                    <div className="problems-label">
                        PRACTICE
                    </div>

                    <h1>
                        Problem
                        <span> Set</span>
                    </h1>

                    <p>
                        Solve problems, improve your
                        skills, and level up your rating.
                    </p>

                </div>


                {/* FILTERS */}

                <div className="problems-filters">

                    {/* SEARCH */}

                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="problem-search"
                    />


                    {/* DIFFICULTY */}

                    <select
                        value={difficulty}
                        onChange={(e) =>
                            setDifficulty(
                                e.target.value
                            )
                        }
                        className="difficulty-filter"
                    >

                        <option value="All">
                            All Difficulties
                        </option>

                        <option value="Easy">
                            Easy
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Hard">
                            Hard
                        </option>

                    </select>


                    {/* TAG */}

                    <select
                        value={tag}
                        onChange={(e) =>
                            setTag(e.target.value)
                        }
                        className="difficulty-filter"
                    >

                        <option value="All">
                            All Tags
                        </option>

                        {allTags.map(
                            (currentTag) => (

                                <option
                                    key={currentTag}
                                    value={currentTag}
                                >
                                    {currentTag}
                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* RESULT COUNT */}

                <div className="problems-result-info">

                    <span>
                        {problems.length}{" "}
                        {
                            problems.length === 1
                                ? "Problem"
                                : "Problems"
                        }
                    </span>

                    <span>
                        Showing {filteredProblems.length} of{" "}
                        {problems.length}{" "}
                        {
                            problems.length === 1
                                ? "problem"
                                : "problems"
                        }
                    </span>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div className="problems-loading">
                        Loading problems...
                    </div>


                ) : filteredProblems.length === 0 ? (

                    <div className="problems-empty">

                        <h2>
                            No problems found
                        </h2>

                        <p>
                            Try changing your search,
                            difficulty, or tag filter.
                        </p>

                    </div>


                ) : (

                    <div className="problems-grid">

                        {filteredProblems.map(
                            (problem) => (

                                <div
                                    key={problem._id}
                                    className="problem-card"
                                    onClick={() =>
                                        navigate(
                                            `/problems/${problem._id}`
                                        )
                                    }
                                >

                                    {/* DIFFICULTY */}

                                    <div className="problem-card-top">

                                        <span
                                            className={
                                                `problem-difficulty ${problem.difficulty?.toLowerCase()}`
                                            }
                                        >
                                            {problem.difficulty}
                                        </span>

                                    </div>


                                    {/* TITLE */}

                                    <h2>
                                        {problem.title}
                                    </h2>


                                    {/* TAGS */}

                                    <div className="problem-tags">

                                        {problem.tags?.map(
                                            (currentTag) => (

                                                <span
                                                    key={
                                                        currentTag
                                                    }
                                                >
                                                    {currentTag}
                                                </span>

                                            )
                                        )}

                                    </div>


                                    {/* FOOTER */}

                                    <div className="problem-card-footer">

                                        {solvedProblems.includes(
                                            problem._id
                                        ) ? (

                                            <span className="problem-solved">
                                                ✓ Solved
                                            </span>

                                        ) : (

                                            <span>
                                                Solve Problem →
                                            </span>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Problems;