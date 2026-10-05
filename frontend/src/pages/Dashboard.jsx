import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Codeforces state
    const [codeforcesHandle, setCodeforcesHandle] = useState("");
    const [codeforcesProfile, setCodeforcesProfile] = useState(null);
    const [cfMessage, setCfMessage] = useState("");
    const [cfError, setCfError] = useState("");
    const [cfLoading, setCfLoading] = useState(false);


    useEffect(() => {

        const getDashboardData = async () => {

            const token =
                localStorage.getItem("accessToken");


            if (!token) {
                navigate("/login");
                return;
            }


            try {

                // GET USER PROFILE
                const profileResponse = await api.get(
                    "/auth/me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                const currentUser =
                    profileResponse.data.user;


                setUser(currentUser);


                // Keep local storage updated
                localStorage.setItem(
                    "user",
                    JSON.stringify(currentUser)
                );


                // Show already linked Codeforces profile
                if (currentUser.codeforcesHandle) {

                    setCodeforcesProfile({
                        handle:
                            currentUser.codeforcesHandle,

                        rating:
                            currentUser.codeforcesRating ?? 0
                    });

                }


                // GET SUBMISSION HISTORY
                const submissionResponse =
                    await api.get(
                        "/submissions/history",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                setSubmissions(
                    submissionResponse.data.submissions || []
                );


            } catch (error) {

                console.error(
                    "Dashboard error:",
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


        getDashboardData();

    }, [navigate]);


    const handleLogout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/login");

    };


    // LINK CODEFORCES PROFILE
    const handleCodeforcesLink = async () => {

        if (!codeforcesHandle.trim()) {

            setCfError(
                "Enter a Codeforces handle"
            );

            setCfMessage("");

            return;
        }


        setCfMessage("");
        setCfError("");
        setCfLoading(true);


        try {

            const token =
                localStorage.getItem("accessToken");


            const response = await api.put(
                "/auth/codeforces",
                {
                    handle:
                        codeforcesHandle.trim()
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setCodeforcesProfile(
                response.data.profile
            );


            // Update user state
            if (response.data.user) {

                setUser(
                    response.data.user
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        response.data.user
                    )
                );

            }


            setCfMessage(
                "Codeforces profile linked successfully!"
            );


            setCodeforcesHandle("");


        } catch (error) {

            console.error(
                "Codeforces linking error:",
                error
            );


            setCfError(
                error.response?.data?.message ||
                "Failed to link Codeforces profile"
            );

        } finally {

            setCfLoading(false);

        }

    };


    /* SUBMISSION STATISTICS */

    const totalSubmissions =
        submissions.length;


    const acceptedSubmissions =
        submissions.filter(
            (submission) =>
                submission.status
                    ?.toLowerCase() === "accepted"
        ).length;


    const acceptanceRate =
        totalSubmissions > 0
            ? Math.round(
                  (acceptedSubmissions /
                      totalSubmissions) *
                      100
              )
            : 0;


    if (loading) {

        return (
            <div className="dashboard-loading">

                Loading RankUp dashboard...

            </div>
        );

    }


    if (!user) {
        return null;
    }


    return (

        <div className="dashboard-page">


            {/* NAVBAR */}

            <nav className="dashboard-nav">

                <div className="dashboard-nav-inner">


                    <div className="dashboard-logo">

                        <div className="dashboard-logo-icon">
                            R
                        </div>

                        <span>
                            RankUp
                        </span>

                    </div>


                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>


                </div>

            </nav>



            {/* MAIN */}

            <main className="dashboard-main">


                {/* WELCOME */}

                <section>

                    <div className="dashboard-label">
                        Dashboard
                    </div>


                    <h1 className="dashboard-title">

                        Welcome back,{" "}

                        <span>
                            {user.username}
                        </span>

                    </h1>


                    <p className="dashboard-description">

                        Track your progress, solve problems
                        and compete with other programmers.

                    </p>

                </section>



                {/* MAIN STATS */}

                <section className="stats-grid">


                    <div className="stat-card">

                        <div className="stat-label">
                            ELO Rating
                        </div>

                        <div className="stat-value">
                            {user.eloRating ?? 1000}
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-label">
                            Problems Solved
                        </div>

                        <div className="stat-value">
                            {user.problemsSolved ?? 0}
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-label">
                            Contests
                        </div>

                        <div className="stat-value">
                            {user.contestsParticipated ?? 0}
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-label">
                            Codeforces Rating
                        </div>

                        <div className="stat-value">
                            {user.codeforcesRating ?? 0}
                        </div>

                    </div>


                </section>



                {/* SUBMISSION PROGRESS */}

                <section className="dashboard-progress-section">

                    <h2 className="quick-title">
                        Submission Progress
                    </h2>


                    <div className="dashboard-progress-grid">


                        <div className="progress-card">

                            <div className="progress-label">
                                Total Submissions
                            </div>

                            <div className="progress-value">
                                {totalSubmissions}
                            </div>

                        </div>


                        <div className="progress-card">

                            <div className="progress-label">
                                Accepted
                            </div>

                            <div className="progress-value progress-accepted">
                                {acceptedSubmissions}
                            </div>

                        </div>


                        <div className="progress-card">

                            <div className="progress-label">
                                Acceptance Rate
                            </div>

                            <div className="progress-value">
                                {acceptanceRate}%
                            </div>

                        </div>


                    </div>

                </section>



                {/* CODEFORCES */}

                <section className="codeforces-card">

                    <div className="codeforces-header">

                        <div>

                            <span className="codeforces-label">
                                CODEFORCES
                            </span>

                            <h2>
                                Connect Your Profile
                            </h2>

                            <p>
                                Sync your Codeforces rating and
                                rank with RankUp.
                            </p>

                        </div>


                        <div className="codeforces-icon">
                            CF
                        </div>

                    </div>


                    <div className="codeforces-form">

                        <input
                            type="text"
                            placeholder="Enter Codeforces handle"
                            value={codeforcesHandle}
                            onChange={(e) =>
                                setCodeforcesHandle(
                                    e.target.value
                                )
                            }
                        />


                        <button
                            onClick={handleCodeforcesLink}
                            disabled={cfLoading}
                        >

                            {cfLoading
                                ? "Linking..."
                                : "Link Profile"}

                        </button>

                    </div>


                    {cfMessage && (

                        <div className="codeforces-success">
                            {cfMessage}
                        </div>

                    )}


                    {cfError && (

                        <div className="codeforces-error">
                            {cfError}
                        </div>

                    )}


                    {codeforcesProfile && (

                        <div className="codeforces-profile">


                            <div>

                                <span>
                                    Handle
                                </span>

                                <strong>
                                    {codeforcesProfile.handle}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Rating
                                </span>

                                <strong>
                                    {codeforcesProfile.rating}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Max Rating
                                </span>

                                <strong>
                                    {codeforcesProfile.maxRating ?? "-"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Rank
                                </span>

                                <strong>
                                    {codeforcesProfile.rank ?? "-"}
                                </strong>

                            </div>


                        </div>

                    )}

                </section>



                {/* QUICK ACTIONS */}

                <section>

                    <h2 className="quick-title">
                        Quick Actions
                    </h2>


                    <div className="actions-grid">


                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/problems")
                            }
                        >

                            <div className="action-icon">
                                💻
                            </div>

                            <div className="action-title">
                                Solve Problems
                            </div>

                            <div className="action-description">
                                Practice competitive programming
                                problems and improve your skills.
                            </div>

                        </button>



                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/arena")
                            }
                        >

                            <div className="action-icon">
                                ⚔️
                            </div>

                            <div className="action-title">
                                CodeArena
                            </div>

                            <div className="action-description">
                                Challenge other programmers
                                in real-time 1v1 battles.
                            </div>

                        </button>



                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/leaderboard")
                            }
                        >

                            <div className="action-icon">
                                🏆
                            </div>

                            <div className="action-title">
                                Leaderboard
                            </div>

                            <div className="action-description">
                                Track your ranking against
                                other competitive programmers.
                            </div>

                        </button>


                    </div>

                </section>


            </main>

        </div>

    );

}


export default Dashboard;