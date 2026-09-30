import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "./ProblemDetails.css";

function ProblemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await api.get(
                    `/problems/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = response.data.problem;

                setProblem(data);
                setCode(data.starterCode?.cpp || "");

            } catch (error) {
                console.error("Problem error:", error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("user");

                    navigate("/login");
                }

            } finally {
                setLoading(false);
            }
        };

        fetchProblem();

    }, [id, navigate]);


    if (loading) {
        return (
            <div className="problem-details-loading">
                Loading problem...
            </div>
        );
    }


    if (!problem) {
        return (
            <div className="problem-details-loading">

                <h2>Problem not found</h2>

                <button
                    onClick={() => navigate("/problems")}
                >
                    ← Back to Problems
                </button>

            </div>
        );
    }


    return (
        <div className="problem-details-page">

            <nav className="problem-details-nav">

                <div
                    className="problem-details-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    <div className="problem-details-logo-icon">
                        R
                    </div>

                    <span>RankUp</span>
                </div>

                <button
                    className="problem-back-btn"
                    onClick={() => navigate("/problems")}
                >
                    ← Problems
                </button>

            </nav>


            <main className="problem-workspace">

                {/* PROBLEM */}
                <section className="problem-panel">

                    <div className="problem-title-section">

                        <div className="problem-details-label">
                            PROBLEM
                        </div>

                        <div className="problem-title-row">

                            <h1>
                                {problem.title}
                            </h1>

                            <span
                                className={
                                    `problem-difficulty ` +
                                    problem.difficulty.toLowerCase()
                                }
                            >
                                {problem.difficulty}
                            </span>

                        </div>


                        <div className="problem-detail-tags">

                            {problem.tags?.map((tag) => (
                                <span key={tag}>
                                    {tag}
                                </span>
                            ))}

                        </div>

                    </div>


                    <div className="problem-content">

                        <section className="problem-section">

                            <h2>
                                Description
                            </h2>

                            <p>
                                {problem.description}
                            </p>

                        </section>


                        {problem.examples?.length > 0 && (

                            <section className="problem-section">

                                <h2>
                                    Examples
                                </h2>

                                {problem.examples.map(
                                    (example, index) => (

                                        <div
                                            className="example-card"
                                            key={index}
                                        >

                                            <strong>
                                                Example {index + 1}
                                            </strong>

                                            <p>
                                                <b>Input:</b>{" "}
                                                {example.input}
                                            </p>

                                            <p>
                                                <b>Output:</b>{" "}
                                                {example.output}
                                            </p>

                                            {example.explanation && (
                                                <p>
                                                    <b>
                                                        Explanation:
                                                    </b>{" "}
                                                    {example.explanation}
                                                </p>
                                            )}

                                        </div>

                                    )
                                )}

                            </section>

                        )}


                        {problem.constraints?.length > 0 && (

                            <section className="problem-section">

                                <h2>
                                    Constraints
                                </h2>

                                <ul>

                                    {problem.constraints.map(
                                        (constraint, index) => (
                                            <li key={index}>
                                                {constraint}
                                            </li>
                                        )
                                    )}

                                </ul>

                            </section>

                        )}

                    </div>

                </section>


                {/* CODE EDITOR */}
                <section className="editor-panel">

                    <div className="editor-header">

                        <span>
                            C++ Editor
                        </span>

                        <button
                            className="run-button"
                            onClick={() => {
                                alert(
                                    "Code execution will be added next."
                                );
                            }}
                        >
                            Run Code
                        </button>

                    </div>


                    <textarea
                        className="code-editor"
                        value={code}
                        onChange={(e) =>
                            setCode(e.target.value)
                        }
                        spellCheck="false"
                    />

                </section>

            </main>

        </div>
    );
}

export default ProblemDetails;