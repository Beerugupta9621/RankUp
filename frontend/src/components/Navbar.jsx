function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <span className="logo-icon">R</span>
                <span>RankUp</span>
            </div>

            <div className="nav-links">
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#community">Community</a>
            </div>

            <div className="nav-actions">
                <button className="login-btn">Log in</button>
                <button className="signup-btn">Get Started</button>
            </div>
        </nav>
    );
}

export default Navbar;