import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";

function App() {
    return (
        <div className="app">
            <Navbar />

            <main>
                <Hero />
                <Features />

                <section className="how-section" id="how-it-works">
                    <div className="section-heading">
                        <span>HOW IT WORKS</span>

                        <h2>
                            Practice.
                            <br />
                            <strong>Compete. Improve.</strong>
                        </h2>
                    </div>

                    <div className="steps">
                        <div className="step">
                            <span>01</span>
                            <h3>Solve Problems</h3>
                            <p>
                                Build your problem-solving skills with curated
                                competitive programming challenges.
                            </p>
                        </div>

                        <div className="step">
                            <span>02</span>
                            <h3>Challenge Others</h3>
                            <p>
                                Enter CodeArena matches and compete against
                                programmers in real time.
                            </p>
                        </div>

                        <div className="step">
                            <span>03</span>
                            <h3>Track Your Growth</h3>
                            <p>
                                Improve your rating and understand your
                                strengths through detailed statistics.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="cta-section" id="community">
                    <div className="cta-box">
                        <span>READY TO LEVEL UP?</span>

                        <h2>
                            Your next rating
                            <br />
                            <strong>starts here.</strong>
                        </h2>

                        <button className="primary-btn">
                            Create Your Account →
                        </button>
                    </div>
                </section>
            </main>

            <footer>
                <div className="logo">
                    <span className="logo-icon">R</span>
                    <span>RankUp</span>
                </div>

                <p>Built for competitive programmers.</p>

                <span>© 2026 RankUp</span>
            </footer>
        </div>
    );
}

export default App;