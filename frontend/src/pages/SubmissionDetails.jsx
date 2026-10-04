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
            try {
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await api.get(`/submissions/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSubmission(response.data.submission);
            } catch (error) {
                console.error(
                    "Failed to fetch submission:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="submission-details-page">
                <div className="submission-details-container">
                    <p>Loading submission...</p>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="submission-details-page">
                <div className="submission-details-container">
                    <h2>Submission not found</h2>

                    <button onClick={() => navigate("/submissions")}>
                        Back to Submissions
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="submission-details-page">
            <div className="submission-details-container">

                <button
                    className="back-button"
                    onClick={() => navigate("/submissions")}
                >
                    ← Back to Submissions
                </button>

                <div className="submission-header">
                    <div>
                        <h1>
                            {submission.problem?.title || "Problem"}
                        </h1>

                        {submission.problem?.difficulty && (
                            <span
                                className={`submission-difficulty ${submission.problem.difficulty.toLowerCase()}`}
                            >
                                {submission.problem.difficulty}
                            </span>
                        )}
                    </div>

                    <div
                        className={`submission-verdict ${submission.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                    >
                        {submission.status}
                    </div>
                </div>

                <div className="submission-info-grid">

                    <div className="submission-info-card">
                        <span>Language</span>
                        <strong>
                            {submission.language?.toUpperCase() || "CPP"}
                        </strong>
                    </div>

                    <div className="submission-info-card">
                        <span>Execution Time</span>
                        <strong>
                            {submission.executionTime || "N/A"}
                        </strong>
                    </div>

                    <div className="submission-info-card">
                        <span>Memory</span>
                        <strong>
                            {submission.memory
                                ? `${submission.memory} KB`
                                : "N/A"}
                        </strong>
                    </div>

                    <div className="submission-info-card">
                        <span>Submitted</span>
                        <strong>
                            {new Date(
                                submission.createdAt
                            ).toLocaleString()}
                        </strong>
                    </div>

                </div>

                <div className="submission-section">
                    <h2>Source Code</h2>

                    <pre className="submission-code">
                        <code>{submission.sourceCode}</code>
                    </pre>
                </div>

                {submission.stdin && (
                    <div className="submission-section">
                        <h2>Input</h2>

                        <pre className="submission-output">
                            {submission.stdin}
                        </pre>
                    </div>
                )}

                {submission.stdout && (
                    <div className="submission-section">
                        <h2>Output</h2>

                        <pre className="submission-output">
                            {submission.stdout}
                        </pre>
                    </div>
                )}

                {submission.stderr && (
                    <div className="submission-section">
                        <h2>Error</h2>

                        <pre className="submission-error">
                            {submission.stderr}
                        </pre>
                    </div>
                )}

                {submission.compileOutput && (
                    <div className="submission-section">
                        <h2>Compilation Output</h2>

                        <pre className="submission-error">
                            {submission.compileOutput}
                        </pre>
                    </div>
                )}

            </div>
        </div>
    );
}

export default SubmissionDetails;