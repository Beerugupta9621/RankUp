import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                formData
            );


            localStorage.setItem(
                "accessToken",
                response.data.accessToken
            );


            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );


            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <div className="login-logo">
                        R
                    </div>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Login to your RankUp account
                    </p>

                </div>


                {error && (

                    <div className="login-error">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="login-form"
                >

                    <div className="login-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="login-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="login-button"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                <p className="login-register">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create Account
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;