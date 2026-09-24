function Hero() {
    return (
        <section className="hero">
            <div className="hero-glow"></div>

            <div className="hero-content">
                <div className="hero-badge">
                    <span></span>
                    Built for competitive programmers
                </div>

                <h1>
                    Master Competitive
                    <br />
                    <span>Programming Faster.</span>
                </h1>

                <p>
                    Practice smarter, compete with others, and track your
                    progress with a platform built for serious problem solvers.
                </p>

                <div className="hero-buttons">
                    <button className="primary-btn">
                        Start Coding
                        <span>→</span>
                    </button>

                    <button className="secondary-btn">
                        Explore Platform
                    </button>
                </div>

                <div className="hero-trust">
                    <div className="avatars">
                        <span>G</span>
                        <span>A</span>
                        <span>S</span>
                        <span>+</span>
                    </div>

                    <p>
                        Built for developers who want to <strong>level up.</strong>
                    </p>
                </div>
            </div>

            <div className="hero-card">
                <div className="card-header">
                    <div>
                        <small>LIVE ARENA</small>
                        <h3>CodeArena #284</h3>
                    </div>

                    <div className="live-dot">
                        <span></span>
                        LIVE
                    </div>
                </div>

                <div className="match-score">
                    <div className="player">
                        <div className="player-avatar">B</div>
                        <strong>You</strong>
                        <span>1248 ELO</span>
                    </div>

                    <div className="vs">VS</div>

                    <div className="player">
                        <div className="player-avatar opponent">A</div>
                        <strong>Opponent</strong>
                        <span>1271 ELO</span>
                    </div>
                </div>

                <div className="progress-container">
                    <div className="progress-label">
                        <span>Problem Progress</span>
                        <span>72%</span>
                    </div>

                    <div className="progress-bar">
                        <div></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;