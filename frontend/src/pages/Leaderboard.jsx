import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "./Leaderboard.css";


function Leaderboard() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchLeaderboard = async () => {

            const token =
                localStorage.getItem("accessToken");


            if (!token) {
                navigate("/login");
                return;
            }


            try {

                const response = await api.get(
                    "/auth/leaderboard",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                setUsers(
                    response.data.leaderboard || []
                );


            } catch (error) {

                console.error(
                    "Leaderboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load leaderboard"
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


        fetchLeaderboard();

    }, [navigate]);


    if (loading) {

        return (
            <div className="leaderboard-loading">
                Loading RankUp Leaderboard...
            </div>
        );

    }


    return (

        <div className="leaderboard-page">


            {/* NAVBAR */}

            <nav className="leaderboard-nav">

                <div className="leaderboard-nav-inner">

                    <div
                        className="leaderboard-logo"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >

                        <div className="leaderboard-logo-icon">
                            R
                        </div>

                        <span>
                            RankUp
                        </span>

                    </div>


                    <button
                        className="leaderboard-back"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                </div>

            </nav>



            {/* MAIN */}

            <main className="leaderboard-main">


                {/* HEADER */}

                <section className="leaderboard-hero">

                    <div className="leaderboard-label">
                        RANKUP RANKINGS
                    </div>

                    <h1>
                        Compete.{" "}
                        <span>Climb.</span>{" "}
                        Conquer.
                    </h1>

                    <p>
                        See how you rank against the
                        RankUp competitive programming
                        community.
                    </p>

                </section>



                {/* ERROR */}

                {error && (

                    <div className="leaderboard-error">
                        {error}
                    </div>

                )}



                {/* TOP THREE */}

                {users.length > 0 && (

                    <section className="top-players">

                        {users
                            .slice(0, 3)
                            .map((user) => (

                                <div
                                    className={
                                        user.rank === 1
                                            ? "top-player first"
                                            : "top-player"
                                    }
                                    key={user.username}
                                >

                                    <div className="top-rank">

                                        {user.rank === 1
                                            ? "🥇"
                                            : user.rank === 2
                                            ? "🥈"
                                            : "🥉"}

                                    </div>


                                    <div className="top-avatar">
                                        {user.username
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>


                                    <h2>
                                        {user.username}
                                    </h2>


                                    <div className="top-elo">
                                        {user.eloRating}
                                    </div>

                                    <span>
                                        ELO Rating
                                    </span>

                                </div>

                            ))}

                    </section>

                )}



                {/* LEADERBOARD TABLE */}

                <section className="leaderboard-card">

                    <div className="leaderboard-card-header">

                        <div>

                            <span>
                                RANKINGS
                            </span>

                            <h2>
                                Global Leaderboard
                            </h2>

                        </div>

                        <div className="player-count">
                            {users.length} Players
                        </div>

                    </div>


                    {users.length === 0 ? (

                        <div className="empty-leaderboard">
                            No players found.
                        </div>

                    ) : (

                        <div className="leaderboard-table-wrapper">

                            <table className="leaderboard-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Rank
                                        </th>

                                        <th>
                                            Player
                                        </th>

                                        <th>
                                            ELO
                                        </th>

                                        <th>
                                            Problems
                                        </th>

                                        <th>
                                            Codeforces
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {users.map((user) => (

                                        <tr
                                            key={user.username}
                                            className={
                                                user.rank <= 3
                                                    ? "top-row"
                                                    : ""
                                            }
                                        >

                                            <td>

                                                <span className="rank-number">

                                                    {user.rank === 1
                                                        ? "🥇"
                                                        : user.rank === 2
                                                        ? "🥈"
                                                        : user.rank === 3
                                                        ? "🥉"
                                                        : `#${user.rank}`}

                                                </span>

                                            </td>


                                            <td>

                                                <div className="player-cell">

                                                    <div className="player-avatar">
                                                        {user.username
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {user.username}
                                                        </strong>

                                                        {user.codeforcesHandle && (

                                                            <span>
                                                                @{user.codeforcesHandle}
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <strong className="elo-value">
                                                    {user.eloRating}
                                                </strong>

                                            </td>


                                            <td>
                                                {user.problemsSolved}
                                            </td>


                                            <td>

                                                {user.codeforcesRating > 0
                                                    ? user.codeforcesRating
                                                    : "Unrated"}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


            </main>

        </div>

    );

}


export default Leaderboard;