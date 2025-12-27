import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../utils/api';
import { AuroraBackground } from '../components/ui/aurora-background';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { SparklesCore } from '../components/ui/sparkles';

import Loader from '../components/ui/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // FAILSAFE: Ensure no stale tokens exist when landing on Login
        const token = localStorage.getItem('token');
        if (token) {
            console.log("Login Page: Clearing stale token found on mount");
            localStorage.removeItem('token');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            login(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <AuroraBackground>
            {isLoading && <Loader />}
            <div className="relative z-20 w-full max-w-md">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-50" />

                <div className="relative w-full p-8 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                    {/* Sparkles Effect */}
                    <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden rounded-2xl">
                        <SparklesCore
                            id="tsparticles"
                            background="transparent"
                            minSize={0.6}
                            maxSize={1.4}
                            particleDensity={50}
                            className="w-full h-full"
                            particleColor="#FFFFFF"
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                            <p className="text-neutral-400 text-sm">Sign in to continue your streak</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                                <span className="bg-red-500 h-1.5 w-1.5 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-neutral-600 transition-all outline-none backdrop-blur-sm"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-neutral-600 transition-all outline-none backdrop-blur-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex justify-center">
                                <HoverBorderGradient
                                    containerClassName="rounded-full"
                                    as="button"
                                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                                >
                                    <span className="font-semibold px-4">Sign In</span>
                                </HoverBorderGradient>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-neutral-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-white hover:text-purple-300 font-medium hover:underline transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
};

export default Login;
