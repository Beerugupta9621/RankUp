import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ArenaRoom.css";

function ArenaRoom() {

    const { roomId } = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState(
        `#include <bits/stdc++.h>
using namespace std;

int main() {

    // Write your solution here

    return 0;
}`
    );

    const [timeLeft, setTimeLeft] = useState(600);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const fetchProblem = async () => {

            const token =
                localStorage.getItem("accessToken");

            if (!token) {
                navigate("/login");
                return;
            }

            try {

                const response = await api.get(
                    "/problems",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const problems =
                    response.data.problems || [];

                if (problems.length > 0) {
                    setProblem(problems[0]);
                }

            } catch (error) {

                console.error(
                    "Arena problem error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchProblem();

    }, [navigate]);


    useEffect(() => {

        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setTimeLeft((previous) => previous - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [timeLeft]);


    const formatTime = () => {

        const minutes =
            Math.floor(timeLeft / 60);

        const seconds =
            timeLeft % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;

    };


    const handleSubmit = () => {

        setSubmitted(true);

    };


    if (loading) {

        return (
            <div className="arena-room-loading">
                Loading CodeArena...
            </div>
        );

    }


    return (
        <div className="arena-room-page">

            {/* HEADER */}

            <header className="arena-room-header">

                <div className="arena-room-brand">

                    <div className="arena-logo-icon">
                        R
                    </div>

                    <span>
                        RankUp
                    </span>

                </div>


                <div className="arena-room-info">

                    <span>
                        Room
                    </span>

                    <strong>
                        {roomId}
                    </strong>

                </div>


                <div className="arena-timer">
                    ⏱ {formatTime()}
                </div>


                <button
                    className="leave-arena-btn"
                    onClick={() =>
                        navigate("/arena")
                    }
                >
                    Leave
                </button>

            </header>


            {/* PLAYERS */}

            <section className="arena-players">

                <div className="arena-player active-player">

                    <div className="player-avatar">
                        P1
                    </div>

                    <div>
                        <strong>
                            Player 1
                        </strong>

                        <span>
                            You
                        </span>
                    </div>

                </div>


                <div className="vs-badge">
                    VS
                </div>


                <div className="arena-player">

                    <div className="player-avatar opponent-avatar">
                        P2
                    </div>

                    <div>
                        <strong>
                            Player 2
                        </strong>

                        <span>
                            Opponent
                        </span>
                    </div>

                </div>

            </section>


            {/* MAIN */}

            <main className="arena-room-main">

                {/* PROBLEM */}

                <section className="arena-problem-panel">

                    {problem ? (
                        <>
                            <div className="problem-header">

                                <div>

                                    <span className="arena-label">
                                        BATTLE PROBLEM
                                    </span>

                                    <h1>
                                        {problem.title}
                                    </h1>

                                </div>

                                <span
                                    className={`difficulty ${problem.difficulty?.toLowerCase()}`}
                                >
                                    {problem.difficulty}
                                </span>

                            </div>


                            <div className="problem-description">

                                <p>
                                    {problem.description}
                                </p>


                                {problem.examples?.length > 0 && (
                                    <div className="example-box">

                                        <h3>
                                            Example
                                        </h3>

                                        <div>
                                            <strong>
                                                Input:
                                            </strong>

                                            <pre>
                                                {problem.examples[0].input}
                                            </pre>
                                        </div>

                                        <div>
                                            <strong>
                                                Output:
                                            </strong>

                                            <pre>
                                                {problem.examples[0].output}
                                            </pre>
                                        </div>

                                    </div>
                                )}

                            </div>

                        </>
                    ) : (
                        <div className="no-problem">
                            No problem available.
                        </div>
                    )}

                </section>


                {/* EDITOR */}

                <section className="arena-editor-panel">

                    <div className="editor-header">

                        <span>
                            C++
                        </span>

                        <span>
                            GNU++17
                        </span>

                    </div>


                    <textarea
                        value={code}
                        onChange={(event) =>
                            setCode(event.target.value)
                        }
                        spellCheck="false"
                        className="arena-code-editor"
                    />


                    <div className="editor-footer">

                        <span>
                            {submitted
                                ? "✓ Submission received"
                                : "Ready to submit"}
                        </span>


                        <button
                            className="arena-submit-btn"
                            onClick={handleSubmit}
                            disabled={submitted}
                        >
                            {submitted
                                ? "Submitted"
                                : "Submit Solution"}
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default ArenaRoom;