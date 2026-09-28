import { Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";


function LandingPage() {
    return (
        <div className="app">

            <Navbar />

            <main>

                <Hero />

                <Features />

                {/* HOW IT WORKS */}
                <section
                    className="how-section"
                    id="how-it-works"
                >
                    <div className="section-heading">

                        <span>
                            HOW IT WORKS
                        </span>

                        <h2>
                            Practice.
                            <br />
                            <strong>
                                Compete. Improve.
                            </strong>
                        </h2>

                    </div>


                    <div className="steps">

                        <div className="step">

                            <span>
                                01
                            </span>

                            <h3>
                                Solve Problems
                            </h3>

                            <p>
                                Build your problem-solving skills
                                with curated competitive programming
                                challenges.
                            </p>

                        </div>


                        <div className="step">

                            <span>
                                02
                            </span>

                            <h3>
                                Challenge Others
                            </h3>

                            <p>
                                Enter CodeArena matches and compete
                                against programmers in real time.
                            </p>

                        </div>


                        <div className="step">

                            <span>
                                03
                            </span>

                            <h3>
                                Track Your Growth
                            </h3>

                            <p>
                                Improve your rating and understand
                                your strengths through detailed
                                statistics.
                            </p>

                        </div>

                    </div>

                </section>


                {/* CALL TO ACTION */}
                <section
                    className="cta-section"
                    id="community"
                >

                    <div className="cta-box">

                        <span>
                            READY TO LEVEL UP?
                        </span>

                        <h2>
                            Your next rating
                            <br />
                            <strong>
                                starts here.
                            </strong>
                        </h2>

                        <Link
                            to="/register"
                            className="primary-btn"
                        >
                            Create Your Account →
                        </Link>

                    </div>

                </section>

            </main>


            {/* FOOTER */}
            <footer>

                <div className="logo">

                    <span className="logo-icon">
                        R
                    </span>

                    <span>
                        RankUp
                    </span>

                </div>


                <p>
                    Built for competitive programmers.
                </p>


                <span>
                    © 2026 RankUp
                </span>

            </footer>

        </div>
    );
}


function App() {

    return (
        <Routes>
           <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/problems" element={<Problems />} />
            
        </Routes>
    );
}


export default App;