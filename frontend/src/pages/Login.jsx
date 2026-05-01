import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();   // ✅ FIX
    const password = formData.password.trim();           // ✅ FIX

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request:", { email, password }); // 🔍 DEBUG

      const { data } = await api.post("/auth/login", {
        email,
        password
      });

      console.log("Login response:", data); // 🔍 DEBUG

      // ✅ Store token + user
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.log("Login error:", err.response); // 🔍 DEBUG

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold text-slate-800 text-center">
          Login 🔐
        </h2>

        {error && (
          <p className="mb-4 rounded-md bg-rose-50 p-2 text-sm text-rose-700 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-sm text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1 block text-sm text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <p className="mt-4 text-sm text-slate-600 text-center">
          No account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;