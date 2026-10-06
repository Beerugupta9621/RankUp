import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Contests.css";

function Contests() {

    const navigate = useNavigate();

    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentTime, setCurrentTime] = useState(
        Math.floor(Date.now() / 1000)
    );

    /* LIVE CLOCK */
    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentTime(
                Math.floor(Date.now() / 1000)
            );

        }, 1000);

        return () => clearInterval(timer);

    }, []);


    /* FETCH CONTESTS */
    useEffect(() => {

        const fetchContests = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("accessToken");

                if (!token) {

                    setError(
                        "Please login to view contests."
                    );

                    setLoading(false);

                    return;
                }

                const response = await api.get(
                    "/auth/codeforces/contests",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                setContests(
                    response.data.contests || []
                );

            } catch (error) {

                console.error(
                    "Contest fetch error:",
                    error
                );

                console.error(
                    "Contest response:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load Codeforces contests."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchContests();

    }, []);


    /* CONTEST DATE */
    const getContestDate = (timestamp) => {

        if (!timestamp) {
            return "Date unavailable";
        }

        return new Date(
            timestamp * 1000
        ).toLocaleString();

    };


    /* COUNTDOWN */
    const getCountdown = (timestamp) => {

        if (!timestamp) {
            return "Time unavailable";
        }

        const difference =
            timestamp - currentTime;

        if (difference <= 0) {
            return "Starting now";
        }

        const days =
            Math.floor(
                difference / (60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (difference % (60 * 60 * 24)) /
                (60 * 60)
            );

        const minutes =
            Math.floor(
                (difference % (60 * 60)) /
                60
            );

        const seconds =
            difference % 60;


        if (days > 0) {

            return `${days}d ${hours}h ${minutes}m`;

        }

        return `${hours}h ${minutes}m ${seconds}s`;

    };


    return (

        <div className="contests-page">

            {/* NAVBAR */}

            <nav className="contests-navbar">

                <div
                    className="contests-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    Rank<span>Up</span>
                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </nav>


            {/* HERO */}

            <section className="contests-hero">

                <p className="contest-label">
                    CONTEST HUB
                </p>

                <h1>
                    Compete. Climb. Conquer.
                </h1>

                <p>
                    Stay updated with upcoming
                    Codeforces contests and never
                    miss your next challenge.
                </p>

            </section>


            {/* CONTESTS */}

            <section className="contests-section">

                <div className="section-heading">

                    <div>

                        <p className="contest-label">
                            UPCOMING CONTESTS
                        </p>

                        <h2>
                            Codeforces Schedule
                        </h2>

                    </div>

                    <span className="live-badge">
                        ● LIVE DATA
                    </span>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="contest-state">

                        <div className="loader"></div>

                        <p>
                            Loading upcoming contests...
                        </p>

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="contest-state error-state">

                        <h3>
                            Unable to load contests
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    contests.length === 0 && (

                        <div className="contest-state">

                            <h3>
                                No upcoming contests
                            </h3>

                            <p>
                                Check back later for
                                new Codeforces contests.
                            </p>

                        </div>

                    )}


                {/* CONTEST LIST */}

                {!loading &&
                    !error &&
                    contests.length > 0 && (

                        <div className="contest-list">

                            {contests.map((contest) => (

                                <div
                                    className="contest-card"
                                    key={contest.id}
                                >

                                    <div className="contest-info">

                                        <span className="contest-type">
                                            {contest.type || "CONTEST"}
                                        </span>

                                        <h3>
                                            {contest.name}
                                        </h3>

                                        <div className="contest-date">

                                            <small>
                                                STARTS
                                            </small>

                                            <strong>
                                                {getContestDate(
                                                    contest.startTimeSeconds
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="contest-countdown">

                                        <small>
                                            STARTS IN
                                        </small>

                                        <strong>
                                            {getCountdown(
                                                contest.startTimeSeconds
                                            )}
                                        </strong>

                                    </div>


                                    <div className="contest-action">

                                        <a
                                            href="https://codeforces.com/contests"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Contest →
                                        </a>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </section>

        </div>

    );

}

export default Contests;