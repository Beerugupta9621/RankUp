import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "./SubmissionDetails.css";

function SubmissionDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchSubmission = async () => {

            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    `/submissions/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setSubmission(
                    response.data.submission
                );

            } catch (error) {

                console.error(
                    "Submission details error:",
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

                } else if (
                    error.response?.status === 404
                ) {

                    setSubmission(null);

                }

            } finally {

                setLoading(false);

            }
        };

        fetchSubmission();

    }, [id, navigate]);


    if (loading) {

        return (
            <div className="submission-details-loading">
                Loading submission...
            </div>
        );

    }


    if (!submission) {

        return (
            <div className="submission-details-loading">

                <h2>
                    Submission not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/submissions")
                    }
                >
                    ← Submission History
                </button>

            </div>
        );

    }


    return (
        <div className="submission-details-page">

            <nav className="submission-details-nav">

                <div
                    className="submission-details-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >

                    <div className="submission-details-logo-icon">
                        R
                    </div>

                    <span>
                        RankUp
                    </span>

                </div>


                <button
                    onClick={() =>
                        navigate("/submissions")
                    }
                >
                    ← History
                </button>

            </nav>


            <main className="submission-details-main">

                <div className="details-label">
                    SUBMISSION
                </div>


                <h1>
                    {
                        submission.problem?.title ||
                        "Unknown Problem"
                    }
                </h1>


                <div className="submission-meta">

                    <div>
                        <span>
                            Verdict
                        </span>

                        <strong>
                            {submission.status}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Difficulty
                        </span>

                        <strong>
                            {
                                submission
                                    .problem
                                    ?.difficulty ||
                                "-"
                            }
                        </strong>
                    </div>


                    <div>
                        <span>
                            Language
                        </span>

                        <strong>
                            {
                                submission.language
                                    ?.toUpperCase() ||
                                "-"
                            }
                        </strong>
                    </div>


                    <div>
                        <span>
                            Time
                        </span>

                        <strong>
                            {
                                submission
                                    .executionTime ||
                                "-"
                            }
                        </strong>
                    </div>


                    <div>
                        <span>
                            Memory
                        </span>

                        <strong>
                            {
                                submission.memory
                                    ? `${submission.memory} KB`
                                    : "-"
                            }
                        </strong>
                    </div>

                </div>


                <section className="code-section">

                    <div className="section-title">
                        Submitted Code
                    </div>

                    <pre>
                        <code>
                            {
                                submission.sourceCode
                            }
                        </code>
                    </pre>

                </section>


                <section className="output-section">

                    <div className="section-title">
                        Output
                    </div>

                    <pre>
                        {
                            submission.stdout ||
                            submission.stderr ||
                            submission.compileOutput ||
                            "No output"
                        }
                    </pre>

                </section>


                <div className="submission-date">

                    Submitted on{" "}
                    {new Date(
                        submission.createdAt
                    ).toLocaleString()}

                </div>

            </main>

        </div>
    );
}

export default SubmissionDetails;