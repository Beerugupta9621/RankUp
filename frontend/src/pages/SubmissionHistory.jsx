import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./SubmissionHistory.css";

function SubmissionHistory() {

    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState("All");


    useEffect(() => {

        const fetchHistory = async () => {

            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    "/submissions/history",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setSubmissions(
                    response.data.submissions
                );

            } catch (error) {

                console.error(
                    "Submission history error:",
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

        fetchHistory();

    }, [navigate]);


    const getStatusClass = (status) => {

        if (!status) {
            return "pending";
        }

        const value =
            status.toLowerCase();

        if (
            value.includes("accepted") ||
            value.includes("success")
        ) {
            return "accepted";
        }

        if (
            value.includes("wrong") ||
            value.includes("error") ||
            value.includes("failed")
        ) {
            return "failed";
        }

        return "pending";
    };


    const filteredSubmissions =
        filter === "All"
            ? submissions
            : submissions.filter(
                (submission) =>
                    submission.status === filter
            );


    return (
        <div className="submission-history-page">

            {/* NAVBAR */}

            <nav className="submission-nav">

                <div
                    className="submission-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >

                    <div className="submission-logo-icon">
                        R
                    </div>

                    <span>
                        RankUp
                    </span>

                </div>


                <button
                    className="submission-back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </nav>


            {/* MAIN */}

            <main className="submission-main">

                <div className="submission-header">

                    <div className="submission-label">
                        ACTIVITY
                    </div>

                    <h1>
                        Submission
                        <span> History</span>
                    </h1>

                    <p>
                        Track your previous code
                        submissions and results.
                    </p>

                </div>


                {loading ? (

                    <div className="submission-loading">
                        Loading submissions...
                    </div>

                ) : submissions.length === 0 ? (

                    <div className="submission-empty">

                        <div className="empty-icon">
                            📋
                        </div>

                        <h2>
                            No submissions yet
                        </h2>

                        <p>
                            Solve a problem and submit
                            your code to see it here.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/problems")
                            }
                        >
                            Browse Problems
                        </button>

                    </div>

                ) : (

                    <>

                        {/* FILTERS */}

                        <div className="submission-filters">

                            <button
                                className={
                                    filter === "All"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setFilter("All")
                                }
                            >
                                All
                            </button>


                            <button
                                className={
                                    filter === "Accepted"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setFilter("Accepted")
                                }
                            >
                                Accepted
                            </button>


                            <button
                                className={
                                    filter === "Wrong Answer"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setFilter("Wrong Answer")
                                }
                            >
                                Wrong Answer
                            </button>


                            <button
                                className={
                                    filter === "Runtime Error"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setFilter("Runtime Error")
                                }
                            >
                                Runtime Error
                            </button>


                            <button
                                className={
                                    filter === "Compilation Error"
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setFilter(
                                        "Compilation Error"
                                    )
                                }
                            >
                                Compilation Error
                            </button>

                        </div>


                        {/* TABLE */}

                        {filteredSubmissions.length === 0 ? (

                            <div className="submission-empty">

                                <div className="empty-icon">
                                    🔍
                                </div>

                                <h2>
                                    No matching submissions
                                </h2>

                                <p>
                                    There are no submissions
                                    with the selected verdict.
                                </p>

                            </div>

                        ) : (

                            <div className="submission-table-wrapper">

                                <table className="submission-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Problem
                                            </th>

                                            <th>
                                                Difficulty
                                            </th>

                                            <th>
                                                Language
                                            </th>

                                            <th>
                                                Verdict
                                            </th>

                                            <th>
                                                Time
                                            </th>

                                            <th>
                                                Memory
                                            </th>

                                            <th>
                                                Submitted
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredSubmissions.map(
                                            (submission) => (

                                                <tr
                                                    key={
                                                        submission._id
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/submissions/${submission._id}`
                                                        )
                                                    }
                                                    className="submission-row"
                                                >

                                                    <td className="problem-name">

                                                        {
                                                            submission
                                                                .problem
                                                                ?.title ||
                                                            "Unknown Problem"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            submission
                                                                .problem
                                                                ?.difficulty ||
                                                            "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            submission
                                                                .language
                                                                ?.toUpperCase() ||
                                                            "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                `status ${getStatusClass(
                                                                    submission.status
                                                                )}`
                                                            }
                                                        >
                                                            {
                                                                submission.status ||
                                                                "Pending"
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        {
                                                            submission
                                                                .executionTime ||
                                                            "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            submission.memory
                                                                ? `${submission.memory} KB`
                                                                : "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            new Date(
                                                                submission.createdAt
                                                            ).toLocaleString()
                                                        }

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </>

                )}

            </main>

        </div>
    );
}

export default SubmissionHistory;