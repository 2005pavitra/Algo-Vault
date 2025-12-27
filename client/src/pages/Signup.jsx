import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../utils/api';
import { AuroraBackground } from '../components/ui/aurora-background';
import { HoverBorderGradient } from '../components/ui/hover-border-gradient';
import { SparklesCore } from '../components/ui/sparkles';

import Loader from '../components/ui/Loader';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/register`, formData);
            login(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
            setIsLoading(false);
        }
    };

    return (
        <AuroraBackground>
            {isLoading && <Loader />}
            <div className="relative z-20 w-full max-w-md">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-50" />

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
                            <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                            <p className="text-neutral-400 text-sm">Join the community of problem solvers</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                                <span className="bg-red-500 h-1.5 w-1.5 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider ml-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-neutral-600 transition-all outline-none backdrop-blur-sm"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-neutral-600 transition-all outline-none backdrop-blur-sm"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-neutral-600 transition-all outline-none backdrop-blur-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pt-2 flex justify-center">
                                <HoverBorderGradient
                                    containerClassName="rounded-full"
                                    as="button"
                                    className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
                                >
                                    <span className="font-semibold px-4">Sign Up</span>
                                </HoverBorderGradient>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-neutral-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white hover:text-blue-300 font-medium hover:underline transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </AuroraBackground>
    );
};

export default Signup;
