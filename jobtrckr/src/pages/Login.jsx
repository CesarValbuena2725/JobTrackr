import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ResetPassword from "../components/resetPassword";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);


    // Email validation regex - RFC 5322 standard
    const validateEmail = (emailStr) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailStr);
    };

    // Calculate password strength
    const calculatePasswordStrength = (pwd) => {
        if (!pwd) return { strength: "none", score: 0, color: "bg-zinc-700" };

        let score = 0;

        // Length checks
        if (pwd.length >= 8) score += 1;
        if (pwd.length >= 12) score += 1;
        if (pwd.length >= 16) score += 1;

        // Character variety checks
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score += 1;

        if (score <= 2) {
            return { strength: "Weak", score: 1, color: "bg-red-500" };
        } else if (score <= 4) {
            return { strength: "Medium", score: 2, color: "bg-yellow-500" };
        } else {
            return { strength: "Strong", score: 3, color: "bg-emerald-500" };
        }
    };
    
    const RESET_COOLDOWN_MS = 60 * 1000;


    const passwordStrength = calculatePasswordStrength(password);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Signup successful! Please check your email to confirm.");
            setEmail("");
            setPassword("");
        }
        setLoading(false);
    };

    useEffect(() => {
        supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setShowResetPassword(true);
            }
        });
    }, []);


    const handleForgotPassword = async () => {
        setError(null);
        setMessage(null);

        const lastRequest = localStorage.getItem("passwordResetLastRequest");
        const now = Date.now();

        if (lastRequest && now - Number(lastRequest) < RESET_COOLDOWN_MS) {
            setError("Please wait before requesting another reset email");
            return;
        }

        if (!email.trim()) {
            setError("Please enter your email address first");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
            setError(error.message);
        } else {
            localStorage.setItem("passwordResetLastRequest", now.toString());
            setMessage("Password reset email sent. Check your inbox.");
        }

        setLoading(false);
    };



    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!email.trim() || !password.trim()) {
            setError("Email and password are required");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-zinc-100 mb-2">JobTrackr</h1>
                    <p className="text-zinc-400">Track and manage your job applications</p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900 rounded-xl shadow-lg shadow-black/40 border border-zinc-800 p-8">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setIsSignup(false)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${!isSignup
                                ? "bg-emerald-600 text-white"
                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsSignup(true)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${isSignup
                                ? "bg-emerald-600 text-white"
                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Area */}
                    {showResetPassword ? (
                        <ResetPassword
                            onComplete={() => {
                                setShowResetPassword(false);
                                setMessage("Password reset successful. You can now log in.");
                            }}
                        />
                    ) : (
                        <form
                            onSubmit={isSignup ? handleSignup : handleLogin}
                            className="space-y-4"
                        >
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                                    >
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible size={20} />
                                        ) : (
                                            <AiOutlineEye size={20} />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength (signup only) */}
                                {isSignup && password && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-zinc-400">
                                                Password Strength:
                                            </span>
                                            <span
                                                className={`text-xs font-medium ${passwordStrength.strength === "Weak"
                                                        ? "text-red-400"
                                                        : passwordStrength.strength === "Medium"
                                                            ? "text-yellow-400"
                                                            : "text-emerald-400"
                                                    }`}
                                            >
                                                {passwordStrength.strength}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color}`}
                                                style={{
                                                    width: `${(passwordStrength.score / 3) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Forgot Password */}
                            {!isSignup && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-sm text-emerald-400 hover:text-emerald-300"
                                        disabled={loading}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Message */}
                            {message && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 text-sm">
                                    {message}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-500 disabled:bg-emerald-800"
                            >
                                {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
                            </button>
                        </form>
                    )}

                </div>

                {/* Footer */}
                <p className="text-center text-zinc-500 text-sm mt-6">
                    {isSignup
                        ? "Already have an account? "
                        : "Don't have an account? "}
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                        {isSignup ? "Login" : "Sign up"}
                    </button>
                </p>
            </div>
        </div>
    );
}
