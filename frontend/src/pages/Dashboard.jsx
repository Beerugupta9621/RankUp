import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);


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


                setUser(
                    profileResponse.data.user
                );


                // Keep local storage updated
                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        profileResponse.data.user
                    )
                );


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