import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, uploadAPI } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import { Spinner } from "../components/ui.jsx";
import { FaGoogle, FaImage } from "react-icons/fa";
import { compressImageToDataUrl } from "../utils/image.js";

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

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Supporter",
    photoURL: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const pwStrong =
    form.password.length >= 6 && /\d/.test(form.password) && /[a-zA-Z]/.test(form.password);

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      const res = await uploadAPI.publicImage(dataUrl);
      set("photoURL", res.data.url);
    } catch (err) {
      setError("Image upload failed, you can paste a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailValid) return setError("Please enter a valid email address.");
    if (!pwStrong)
      return setError(
        "Password must be at least 6 characters and include letters and numbers."
      );
    setBusy(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.token, res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    const p = decodeCredential(credentialResponse.credential);
    if (!p?.email) return setError("Google sign up failed");
    try {
      const res = await authAPI.googleLogin({
        name: p.name,
        email: p.email,
        photoURL: p.picture,
      });
      login(res.data.token, res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google sign up failed");
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
      setError(err.response?.data?.message || "Google sign up failed");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-slate-800">Join Clodfare</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create an account to start supporting or creating.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" required value={form.name}
              onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required value={form.email}
              onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
            {form.email && !emailValid && (
              <p className="mt-1 text-xs text-rose-500">Invalid email format.</p>
            )}
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" required value={form.password}
              onChange={(e) => set("password", e.target.value)} placeholder="At least 6 chars, letters + numbers" />
            {form.password && !pwStrong && (
              <p className="mt-1 text-xs text-rose-500">
                Use 6+ characters with letters and numbers.
              </p>
            )}
          </div>
          <div>
            <label className="label">I want to join as</label>
            <select className="input" value={form.role}
              onChange={(e) => set("role", e.target.value)}>
              <option value="Supporter">Supporter (gets 50 credits)</option>
              <option value="Creator">Creator (gets 20 credits)</option>
            </select>
          </div>
          <div>
            <label className="label">Profile Picture</label>
            <div className="flex items-center gap-3">
              <img
                src={form.photoURL || "/favicon.svg"}
                alt="preview"
                className="h-14 w-14 rounded-full border border-slate-200 object-cover"
              />
              <label className="btn-outline cursor-pointer">
                <FaImage /> {uploading ? "Uploading…" : "Upload"}
                <input type="file" accept="image/*" hidden onChange={handleImage} />
              </label>
            </div>
            <input className="input mt-2" value={form.photoURL}
              onChange={(e) => set("photoURL", e.target.value)}
              placeholder="…or paste an image URL" />
          </div>

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? <Spinner label="Creating…" /> : "Create Account"}
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
              onError={() => setError("Google sign up failed")}
              text="signup_with"
            />
          </div>
        ) : (
          <button onClick={demoGoogle} className="btn-outline w-full">
            <FaGoogle className="text-rose-500" /> Continue with Google (Demo)
          </button>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
