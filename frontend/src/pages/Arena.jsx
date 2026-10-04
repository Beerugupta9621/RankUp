import { useNavigate } from "react-router-dom";
import "./Arena.css";

function Arena() {

    const navigate = useNavigate();

    return (
        <div className="arena-page">

            <nav className="arena-nav">

                <div
                    className="arena-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    <div className="arena-logo-icon">
                        R
                    </div>

                    <span>RankUp</span>
                </div>

                <button
                    className="arena-back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </nav>


            <main className="arena-main">

                <div className="arena-label">
                    CODEARENA
                </div>

                <h1 className="arena-title">
                    Compete. Code. <span>Conquer.</span>
                </h1>

                <p className="arena-description">
                    Challenge another programmer in a real-time
                    1v1 coding battle.
                </p>


                <div className="arena-card">

                    <div className="arena-icon">
                        ⚔️
                    </div>

                    <h2>
                        CodeArena
                    </h2>

                    <p>
                        Real-time competitive coding battles
                        are coming to RankUp.
                    </p>

                    <button
                        className="find-match-btn"
                        onClick={() => alert("Matchmaking coming soon!")}
                    >
                        Find Match
                    </button>

                </div>


                <div className="arena-features">

                    <div className="arena-feature-card">

                        <div className="feature-icon">
                            ⚡
                        </div>

                        <h3>
                            Real-Time Battles
                        </h3>

                        <p>
                            Compete against another programmer
                            in a live coding environment.
                        </p>

                    </div>


                    <div className="arena-feature-card">

                        <div className="feature-icon">
                            🎯
                        </div>

                        <h3>
                            Same Problem
                        </h3>

                        <p>
                            Both players receive the same
                            competitive programming challenge.
                        </p>

                    </div>


                    <div className="arena-feature-card">

                        <div className="feature-icon">
                            🏆
                        </div>

                        <h3>
                            Earn ELO
                        </h3>

                        <p>
                            Win battles and increase your
                            competitive ranking.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Arena;