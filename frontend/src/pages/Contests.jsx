import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Contests.css";

function Contests() {

    const navigate = useNavigate();

    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchContests = async () => {

            try {

                const response =
                    await api.get("/auth/codeforces/contests");

                setContests(
                    response.data.contests || []
                );

            } catch (error) {

                console.error(
                    "Contest fetch error:",
                    error
                );

                setError(
                    "Unable to load Codeforces contests."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchContests();

    }, []);


    const getContestDate = (timestamp) => {

        if (!timestamp) {
            return "Date unavailable";
        }

        return new Date(
            timestamp * 1000
        ).toLocaleString();

    };


    return (
        <div className="contests-page">

            <nav className="contests-navbar">

                <div
                    className="contests-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    RankUp
                </div>

                <div className="contests-nav-links">

                    <button
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/problems")}
                    >
                        Problems
                    </button>

                    <button
                        onClick={() => navigate("/leaderboard")}
                    >
                        Leaderboard
                    </button>

                </div>

            </nav>


            <main className="contests-container">

                <section className="contests-hero">

                    <span>
                        CONTEST HUB
                    </span>

                    <h1>
                        Compete. Climb. Conquer.
                    </h1>

                    <p>
                        Stay updated with upcoming
                        Codeforces contests and never
                        miss your next challenge.
                    </p>

                </section>


                <section className="contests-card">

                    <div className="contests-card-header">

                        <div>

                            <span>
                                UPCOMING CONTESTS
                            </span>

                            <h2>
                                Codeforces Schedule
                            </h2>

                        </div>

                        <div className="live-indicator">
                            <span></span>
                            LIVE DATA
                        </div>

                    </div>


                    {loading && (

                        <div className="contest-loading">
                            Loading contests...
                        </div>

                    )}


                    {!loading && error && (

                        <div className="contest-error">
                            {error}
                        </div>

                    )}


                    {!loading &&
                        !error &&
                        contests.length === 0 && (

                            <div className="contest-empty">
                                No upcoming contests found.
                            </div>

                        )}


                    {!loading &&
                        !error &&
                        contests.length > 0 && (

                            <div className="contest-list">

                                {contests.map(
                                    (contest) => (

                                        <div
                                            className="contest-item"
                                            key={contest.id}
                                        >

                                            <div className="contest-main">

                                                <div className="contest-icon">
                                                    CF
                                                </div>

                                                <div>

                                                    <h3>
                                                        {contest.name}
                                                    </h3>

                                                    <p>
                                                        {contest.type ||
                                                            "Codeforces Contest"}
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="contest-date">

                                                <span>
                                                    STARTS
                                                </span>

                                                <strong>
                                                    {getContestDate(
                                                        contest.startTimeSeconds
                                                    )}
                                                </strong>

                                            </div>


                                            <a
                                                href={`https://codeforces.com/contest/${contest.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="contest-button"
                                            >
                                                View Contest →
                                            </a>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </section>

            </main>

        </div>
    );
}

export default Contests;