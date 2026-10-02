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


    useEffect(() => {

        const fetchProblems = async () => {

            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

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

            return (
                matchesSearch &&
                matchesDifficulty
            );

        });


    return (
        <div className="problems-page">

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

                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="problem-search"
                    />


                    <select
                        value={difficulty}
                        onChange={(e) =>
                            setDifficulty(e.target.value)
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

                </div>


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
                            Try changing your search
                            or difficulty filter.
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

                                    <div className="problem-card-top">

                                        <span
                                            className={
                                                `problem-difficulty ${problem.difficulty?.toLowerCase()}`
                                            }
                                        >
                                            {problem.difficulty}
                                        </span>

                                    </div>


                                    <h2>
                                        {problem.title}
                                    </h2>


                                    <div className="problem-tags">

                                        {problem.tags?.map(
                                            (tag) => (

                                                <span
                                                    key={tag}
                                                >
                                                    {tag}
                                                </span>

                                            )
                                        )}

                                    </div>


                                    <div className="problem-card-footer">

                                        <span>
                                            Solve Problem →
                                        </span>

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