import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const getProfile = async () => {

            const token =
                localStorage.getItem("accessToken");


            if (!token) {
                navigate("/login");
                return;
            }


            try {

                const response = await api.get(
                    "/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                setUser(response.data.user);


                // Keep local storage updated
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );


            } catch (error) {

                console.error(
                    "Profile error:",
                    error
                );


                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "user"
                );


                navigate("/login");

            } finally {

                setLoading(false);

            }

        };


        getProfile();

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



                {/* STATS */}

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