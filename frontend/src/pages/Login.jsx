import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

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

            // Save JWT access token
            localStorage.setItem(
                "accessToken",
                response.data.accessToken
            );

            // Save basic user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Go to dashboard
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
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

            <div className="w-full max-w-md">

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                    <h1 className="text-3xl font-bold text-center mb-2">
                        Welcome Back
                    </h1>

                    <p className="text-gray-400 text-center mb-8">
                        Login to your RankUp account
                    </p>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 outline-none focus:border-purple-500"
                            />
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>


                    <p className="text-center text-gray-400 mt-6">
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="text-purple-400 hover:text-purple-300"
                        >
                            Create Account
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;