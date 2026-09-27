import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="logo">
                <span className="logo-icon">
                    R
                </span>

                <span>
                    RankUp
                </span>
            </div>


            <div className="nav-links">

                <a href="#features">
                    Features
                </a>

                <a href="#how-it-works">
                    How It Works
                </a>

                <a href="#community">
                    Community
                </a>

            </div>


            <div className="nav-actions">

                <Link
                    to="/login"
                    className="login-btn"
                >
                    Log in
                </Link>


                <Link
                    to="/register"
                    className="signup-btn"
                >
                    Get Started
                </Link>

            </div>

        </nav>
    );
}

export default Navbar;