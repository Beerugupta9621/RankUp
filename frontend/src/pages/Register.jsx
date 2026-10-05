import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
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

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/register",
                formData
            );

            setMessage(response.data.message);

            setFormData({
                username: "",
                email: "",
                password: ""
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="register-page">

            <div className="register-card">

                <div className="register-header">

                    <div className="register-logo">
                        R
                    </div>

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Join the RankUp competitive programming community
                    </p>

                </div>


                {message && (

                    <div className="register-success">
                        {message}

                        <button
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </div>

                )}


                {error && (

                    <div className="register-error">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="register-form"
                >

                    <div className="register-field">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                            minLength={3}
                            maxLength={30}
                        />

                    </div>


                    <div className="register-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />

                    </div>


                    <div className="register-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            required
                            minLength={6}
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="register-button"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                <p className="register-login">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;