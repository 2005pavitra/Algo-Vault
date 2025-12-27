import SettingsModal from '../components/SettingsModal';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Heatmap from '../components/Heatmap';
import ReviewCard from '../components/ReviewCard';
import { SparklesCore } from '../components/ui/sparkles';
import { BentoGrid } from '../components/ui/bento-grid';
import { Button } from '../components/ui/moving-border';
import { Card } from '../components/ui/card';
import { motion } from 'framer-motion';
import Loader from '../components/ui/Loader';
import { Logo } from '../components/ui/Logo';
import { TextGenerateEffect } from '../components/ui/text-generate-effect';
import API_URL from '../utils/api';

const Dashboard = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [reviewProblems, setReviewProblems] = useState([]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { logout, user } = useContext(AuthContext);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Reset session state on refresh/platform change
            setCurrentProblemIndex(0);
            setIsSessionComplete(false);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsLoading(false);
                    return;
                }
                const headers = { 'Authorization': `Bearer ${token}` };



                // Handling Promise.all significantly depends on what we want to display.
                // Reverting to simple logic: distinct calls.

                const reviewRes = await axios.get(`${API_URL}/problems/review?platform=${selectedPlatform}`, { headers });
                setReviewProblems(reviewRes.data);

                if (selectedPlatform === 'LeetCode') {
                    try {
                        const leetcodeRes = await axios.get(`${API_URL}/leetcode/progress`, { headers });
                        console.log("LeetCode Live Data:", leetcodeRes.data);
                        // TODO: Use this data to populate a real heatmap or stats.
                        // For the heatmap, we specifically need the submission calendar which is in `matchedUser.submissionCalendar`.
                        // Let's fallback to local data for the heatmap component for now to avoid breaking it, 
                        // as we need to parse the timestamp map.
                    } catch (err) {
                        if (err.response && err.response.status === 400) {
                            // Credentials missing
                            setIsSettingsOpen(true);
                        }
                    }
                }

                const heatmapRes = await axios.get(`${API_URL}/heatmap/local?platform=${selectedPlatform}`, { headers });
                setHeatmapData(heatmapRes.data);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                // If 400 or 401, token is likely invalid. Logout.
                if (err.response && (err.response.status === 400 || err.response.status === 401)) {
                    console.log("Invalid token detected (400/401), logging out...");
                    logout();
                }
                setHeatmapData([{ date: '2025-01-01', count: 0 }]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedPlatform]);

    // Force re-login if username is missing from token (legacy token)
    useEffect(() => {
        if (user && !user.username) {
            console.log("Legacy token detected, logging out to refresh...");
            logout();
        }
    }, [user, logout]);

    const currentProblem = !isSessionComplete && reviewProblems.length > 0
        ? reviewProblems[currentProblemIndex]
        : null;

    const handleNextProblem = () => {
        if (currentProblemIndex < reviewProblems.length - 1) {
            setCurrentProblemIndex(prev => prev + 1);
        } else {
            setIsSessionComplete(true);
        }
    };

    const handleReview = (rating) => {
        if (!currentProblem) return;
        handleNextProblem();
        const token = localStorage.getItem('token');
        axios.post(`${API_URL}/problems/${currentProblem._id}/review`, { rating }, { headers: { 'Authorization': `Bearer ${token}` } })
            .catch(err => console.error("Error submitting review:", err));
    };

    const handleAddProblem = () => {
        alert("To add a problem, use the Algo-Vault Chrome Extension on LeetCode!");
    };

    const handleSkipSession = () => handleNextProblem();

    return (
        <div className="min-h-screen w-full bg-black text-white relative font-sans selection:bg-indigo-500/30">
            {isLoading && <Loader />}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {/* Full Screen Sparkles Background */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="w-12 h-12" />
                        <span className="text-white font-bold text-2xl tracking-tight hidden sm:block">Algo-Vault</span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        {user?.username && (
                            <span className="text-neutral-400 text-base hidden lg:inline-block font-medium">
                                <span className="opacity-50">Welcome back, </span>
                                <span className="text-neutral-200 font-bold">{user.username}</span>
                            </span>
                        )}

                        {/* Platform Filter Dropdown */}
                        <div className="relative group">
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="appearance-none bg-neutral-900 text-white text-sm font-medium border border-neutral-800 rounded-xl pl-4 pr-10 py-2.5 hover:border-neutral-700 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                            >
                                <option value="All">All Platforms</option>
                                <option value="LeetCode">LeetCode</option>
                                <option value="CodeChef">CodeChef</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        <Button
                            borderRadius="1rem"
                            className="bg-neutral-900 text-white font-bold tracking-wide text-base border-neutral-800 hover:bg-neutral-800 transition-colors"
                            containerClassName="h-12 w-48 hidden md:block"
                            onClick={handleAddProblem}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add Problem
                            </span>
                        </Button>

                        <button
                            onClick={logout}
                            className="group flex items-center justify-center p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-neutral-400 transition-all duration-300"
                            title="Logout"
                        >
                            <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* Hero Text */}
                <div className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <TextGenerateEffect words="Master Your Algorithms" className="text-4xl md:text-6xl text-center" />
                    </div>
                    <p className="text-neutral-300 max-w-2xl mx-auto text-xl md:text-2xl leading-relaxed">
                        Smart spaced repetition for competitive programmers. Keep your streak alive and never forget a pattern again.
                    </p>
                </div>

                <BentoGrid className="max-w-7xl mx-auto gap-8">

                    {/* Item 1: Heatmap (Full Width, Now Top) */}
                    <div className="md:col-span-3 row-span-1">
                        <Card className="h-full border-blue-500/20 bg-neutral-900/80 p-6 flex flex-col group overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-500/20 transition-colors" />

                            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        Consistency Tracker
                                    </h3>
                                    <p className="text-neutral-500 text-sm font-mono tracking-wider ml-1">ACTIVITY MAP • LOCALHOST</p>
                                </div>
                                <div className="text-right mt-4 sm:mt-0 bg-neutral-900/50 p-3 rounded-xl border border-neutral-800">
                                    <span className="text-xs text-neutral-400 block uppercase tracking-wider font-semibold mb-1">Total Submissions</span>
                                    <span className="text-3xl font-bold text-white">{heatmapData.reduce((acc, curr) => acc + curr.count, 0)}</span>
                                </div>
                            </div>

                            <div className="w-full overflow-x-auto pb-2 transition-all duration-500 opacity-90 group-hover:opacity-100">
                                <div className="min-w-[700px]">
                                    {/* Only show heatmap if data exists */}
                                    {heatmapData.length > 0 ? (
                                        <Heatmap data={heatmapData} />
                                    ) : (
                                        <div className="h-32 flex items-center justify-center text-neutral-600 border border-dashed border-neutral-800 rounded-lg">No activity recorded yet. Start solving!</div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Item 2: Review Card (Spans 2 cols) */}
                    <div className="md:col-span-2 md:row-span-2">
                        <Card className="h-full border-purple-500/20 bg-neutral-900/80 flex flex-col justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

                            <div className="relative z-10 w-full h-full p-4 flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                        </span>
                                        Review Session
                                    </h2>
                                    {!isSessionComplete && reviewProblems.length > 0 && (
                                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-mono border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                                            {reviewProblems.length - currentProblemIndex} REMAINING
                                        </span>
                                    )}
                                </div>

                                <div className="flex-grow min-h-0 w-full flex flex-col">
                                    {isSessionComplete ? (
                                        <div className="text-center h-full flex flex-col items-center justify-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30"
                                            >
                                                <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                            </motion.div>
                                            <h3 className="text-3xl font-bold text-white mb-2">All Caught Up!</h3>
                                            <p className="text-neutral-400 mb-8 max-w-sm mx-auto">Your brain is optimizing. Come back later for more reviews.</p>
                                            <button onClick={() => window.location.reload()} className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4">Reset View</button>
                                        </div>
                                    ) : currentProblem ? (
                                        <div className="w-full flex-1 min-h-0 relative">
                                            <ReviewCard
                                                problem={currentProblem}
                                                onReview={handleReview}
                                                onSkip={handleSkipSession}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-10 text-center animate-in fade-in zoom-in duration-500">
                                            <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                </svg>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-4">All Caught Up!</h3>
                                            <p className="text-neutral-400 max-w-[300px] mx-auto text-lg leading-relaxed mb-8">
                                                Great job! You've cleared your queue for now.
                                            </p>
                                            <Button
                                                borderRadius="1rem"
                                                className="bg-neutral-900 text-neutral-300 border-neutral-800 text-base px-8 h-12 font-bold tracking-wide whitespace-nowrap"
                                                containerClassName="h-12 w-56"
                                                onClick={() => alert("Practice Random Problem feature coming soon!")}
                                            >
                                                Practice Random
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Item 3: Quick Stats (Spans 1 col, 1 row) */}
                    <div className="md:col-span-1 md:row-span-1">
                        <Card className="h-full border-neutral-800 bg-neutral-900/50 flex flex-col relative overflow-hidden group shadow-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-colors duration-500" />

                            <div className="p-6 relative z-10 flex flex-col h-full">
                                <h3 className="text-xl font-bold text-neutral-200 mb-6 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    Quick Actions
                                </h3>

                                <div className="grid grid-cols-2 gap-4 flex-grow content-center h-full">
                                    <button onClick={() => alert("History feature coming in v2!")} className="group/btn relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 transition-all hover:bg-neutral-800 hover:border-neutral-700 active:scale-95 flex flex-col items-center justify-center gap-3">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
                                        <div className="p-2 rounded-full bg-neutral-800 w-fit text-indigo-400 group-hover/btn:bg-indigo-500/20 group-hover/btn:text-indigo-300 transition-colors">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">History</span>
                                    </button>

                                    <button onClick={() => alert("Analytics coming soon!")} className="group/btn relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 transition-all hover:bg-neutral-800 hover:border-neutral-700 active:scale-95 flex flex-col items-center justify-center gap-3">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
                                        <div className="p-2 rounded-full bg-neutral-800 w-fit text-purple-400 group-hover/btn:bg-purple-500/20 group-hover/btn:text-purple-300 transition-colors">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">Analytics</span>
                                    </button>

                                    <button onClick={() => setIsSettingsOpen(true)} className="group/btn relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 transition-all hover:bg-neutral-800 hover:border-neutral-700 active:scale-95 flex flex-col items-center justify-center gap-3">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
                                        <div className="p-2 rounded-full bg-neutral-800 w-fit text-gray-400 group-hover/btn:bg-gray-500/20 group-hover/btn:text-gray-300 transition-colors">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">Settings</span>
                                    </button>

                                    <button onClick={() => alert("Premium features coming soon!")} className="group/btn relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/25 flex flex-col items-center justify-center gap-3">
                                        <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover/btn:opacity-100" />
                                        <div className="p-2 rounded-full bg-white/10 w-fit text-warning group-hover/btn:rotate-12 transition-transform">
                                            <svg className="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase tracking-wide">Go Pro</span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Item 4: Motivation / Quote (Spans 1 col, 1 row) - New Item filling gap */}
                    <div className="md:col-span-1 md:row-span-1">
                        <Card className="h-full border-neutral-800 bg-neutral-900/50 flex flex-col justify-center relative overflow-hidden shadow-none">
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
                            <div className="p-6 text-center space-y-4 relative z-10">
                                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h4 className="text-lg font-bold text-white">Keep the Streak!</h4>
                                <p className="text-neutral-400 text-sm leading-relaxed px-2">
                                    "Consistency is not about perfection. It is about refusing to give up."
                                </p>
                                <div className="pt-2">
                                    <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/30 pb-0.5">Top 1% Mindset</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                </BentoGrid>

                {/* Footer */}
                <footer className="max-w-7xl mx-auto mt-20 border-t border-neutral-800 py-10 text-center">
                    <p className="text-neutral-500 text-base mb-2">
                        &copy; {new Date().getFullYear()} Algo-Vault. Built for competitive programmers.
                    </p>
                    <p className="text-neutral-600 text-sm mb-6">
                        Designed & Built by <span className="text-neutral-400 font-medium">Pavitra</span>
                    </p>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">Privacy</a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">Terms</a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">Twitter</a>
                        <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">GitHub</a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;
