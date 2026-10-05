import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Arena.css";

function Arena() {

    const navigate = useNavigate();

    const [socket, setSocket] = useState(null);
    const [status, setStatus] = useState("idle");
    const [roomId, setRoomId] = useState("");


    useEffect(() => {

        const newSocket = io("http://localhost:5000");

        setSocket(newSocket);


        newSocket.on("waiting_for_opponent", () => {

            setStatus("waiting");

        });


        newSocket.on("match_found", (data) => {

            setRoomId(data.roomId);

            setStatus("matched");

        });


        return () => {

            newSocket.disconnect();

        };

    }, []);


    const findMatch = () => {

        if (!socket) {
            return;
        }

        setStatus("searching");

        socket.emit("find_match");

    };


    const cancelMatch = () => {

        if (!socket) {
            return;
        }

        socket.emit("cancel_matchmaking");

        setStatus("idle");

    };


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

                    <span>
                        RankUp
                    </span>

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
                    Challenge another programmer in a
                    real-time 1v1 coding battle.
                </p>


                <div className="arena-card">

                    <div className="arena-icon">
                        ⚔️
                    </div>


                    <h2>
                        CodeArena
                    </h2>


                    {status === "idle" && (
                        <>
                            <p>
                                Find an opponent and start
                                a competitive coding battle.
                            </p>

                            <button
                                className="find-match-btn"
                                onClick={findMatch}
                            >
                                Find Match
                            </button>
                        </>
                    )}


                    {status === "searching" && (
                        <>
                            <p>
                                Connecting to CodeArena...
                            </p>
                        </>
                    )}


                    {status === "waiting" && (
                        <>
                            <p>
                                🔎 Looking for an opponent...
                            </p>

                            <button
                                className="find-match-btn"
                                onClick={cancelMatch}
                            >
                                Cancel
                            </button>
                        </>
                    )}


                    {status === "matched" && (
                        <>
                            <p>
                                🎉 Opponent found!
                            </p>

                            <div className="arena-room-id">
                                Room: {roomId}
                            </div>

                            <button
                                className="find-match-btn"
                                onClick={() =>
                                    navigate(`/arena/${roomId}`)
                                }
                            >
                                Enter Arena
                            </button>
                        </>
                    )}

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