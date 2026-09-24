function Features() {
    return (
        <section className="features-section" id="features">
            <div className="section-heading">
                <span>WHY RANKUP</span>

                <h2>
                    Everything you need to
                    <br />
                    <strong>level up your skills.</strong>
                </h2>

                <p>
                    From daily practice to competitive battles, RankUp brings
                    the complete competitive programming experience together.
                </p>
            </div>

            <div className="feature-grid">
                <div className="feature-card">
                    <div className="feature-icon">⚔</div>
                    <h3>Live Arena</h3>
                    <p>
                        Challenge other programmers in real-time 1v1 coding
                        battles and prove your skills.
                    </p>
                    <span className="feature-link">Enter Arena →</span>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">◈</div>
                    <h3>Smart Analytics</h3>
                    <p>
                        Understand your progress with ratings, solved
                        problems, submissions and performance insights.
                    </p>
                    <span className="feature-link">View Analytics →</span>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">◉</div>
                    <h3>Community Hub</h3>
                    <p>
                        Discuss problems, share solutions and learn from a
                        community of competitive programmers.
                    </p>
                    <span className="feature-link">Join Community →</span>
                </div>
            </div>
        </section>
    );
}

export default Features;