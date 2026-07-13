import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authAPI } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner } from "../components/ui.jsx";
import { FaGoogle } from "react-icons/fa";

const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

function decodeCredential(credential) {
  try {
    const payload = credential.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await authAPI.login({ email, password });
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    const profile = decodeCredential(credentialResponse.credential);
    if (!profile?.email) return setError("Google login failed");
    try {
      const res = await authAPI.googleLogin({
        name: profile.name,
        email: profile.email,
        photoURL: profile.picture,
      });
      login(res.data.token, res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  const demoGoogle = async () => {
    try {
      const res = await authAPI.googleLogin({
        name: "Demo Google User",
        email: "demo.google@clodfare.com",
        photoURL: "https://i.pravatar.cc/100?img=5",
      });
      login(res.data.token, res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue to Clodfare.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <Spinner label="Signing in…" /> : "Sign In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> OR{" "}
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {hasGoogle ? (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError("Google login failed")}
            />
          </div>
        ) : (
          <button onClick={demoGoogle} className="btn-outline w-full">
            <FaGoogle className="text-rose-500" /> Continue with Google (Demo)
          </button>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          New to Clodfare?{" "}
          <Link to="/register" className="font-semibold text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
