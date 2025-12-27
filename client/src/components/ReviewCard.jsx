import React, { useState } from 'react';
import CodeViewer from './CodeViewer';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewCard = ({ problem, onReview, onSkip }) => {
    const [revealed, setRevealed] = useState(false);
    const [fontSize, setFontSize] = useState(14);

    const difficultyColors = {
        again: "from-red-500 to-rose-600 shadow-red-500/20",
        hard: "from-orange-500 to-amber-600 shadow-orange-500/20",
        good: "from-emerald-500 to-green-600 shadow-emerald-500/20",
        easy: "from-blue-500 to-cyan-600 shadow-blue-500/20",
    };

    // Helper for relative time
    const getDaysAgo = (date) => {
        if (!date) return 'Never';
        const diffTime = Math.abs(new Date() - new Date(date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    };

    return (
        <div className="flex flex-col h-full w-full min-h-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-800 flex-none bg-neutral-900/50 pt-2 px-2 rounded-t-xl">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {problem.platform}
                        </span>
                        {problem.srsData.lastDifficulty && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${problem.srsData.lastDifficulty === 'hard' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                problem.srsData.lastDifficulty === 'again' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    problem.srsData.lastDifficulty === 'easy' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                Last: {problem.srsData.lastDifficulty}
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-white leading-tight tracking-tight line-clamp-1">
                        {problem.title}
                    </h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="text-right hidden sm:block">
                        <div className="flex flex-col items-end gap-1">
                            {/* Last Reviewed */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Last Review</span>
                                <div className="inline-block px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                                    <p className="text-xs font-bold text-neutral-300">
                                        {getDaysAgo(problem.srsData.lastReviewed)}
                                    </p>
                                </div>
                            </div>
                            {/* Target Date */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Due</span>
                                <div className="inline-block px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700">
                                    <p className="text-xs font-bold text-indigo-300">
                                        {new Date(problem.srsData.nextReviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {onSkip && (
                        <button
                            onClick={onSkip}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/50 text-neutral-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider"
                        >
                            Skip
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative flex-grow min-h-[400px] bg-neutral-900/50 rounded-b-xl overflow-hidden border border-white/5 shadow-2xl group">
                {/* Code Viewer Container - Absolute for scrolling */}
                <motion.div
                    animate={{ filter: revealed ? "blur(0px)" : "blur(12px)", opacity: revealed ? 1 : 0.4 }}
                    className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent bg-[#1e1e1e]"
                >
                    <CodeViewer code={problem.code} fontSize={fontSize} />
                </motion.div>

                {/* Font Size Controls (Visible only when revealed) */}
                <AnimatePresence>
                    {revealed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-4 right-4 flex flex-col gap-1 z-10 bg-black/50 backdrop-blur-md p-1 rounded-lg border border-white/10"
                        >
                            <button
                                onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
                                className="p-1 px-2 text-white hover:bg-white/10 rounded text-xs"
                                title="Increase Font Size"
                            >
                                A+
                            </button>
                            <button
                                onClick={() => setFontSize(prev => Math.max(prev - 2, 10))}
                                className="p-1 px-2 text-white hover:bg-white/10 rounded text-xs"
                                title="Decrease Font Size"
                            >
                                A-
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {!revealed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-sm"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setRevealed(true)}
                                className="group relative px-8 py-4 bg-black rounded-full overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.3)] border border-indigo-500/50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />

                                <span className="relative z-10 flex items-center gap-2 font-bold text-white tracking-wide">
                                    <svg className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Tap to Reveal
                                </span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Action Footer */}
            <AnimatePresence>
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        className="mt-4 pt-0 flex-none origin-top"
                    >
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-3 text-[10px] font-medium uppercase tracking-widest">
                            Rate Difficulty
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {['again', 'hard', 'good', 'easy'].map((rating) => (
                                <motion.button
                                    key={rating}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onReview && onReview(rating)}
                                    className={`
                                        py-2.5 px-3 rounded-lg font-bold text-sm text-white shadow-lg 
                                        bg-gradient-to-br ${difficultyColors[rating]}
                                        hover:shadow-xl transition-all
                                        capitalize
                                    `}
                                >
                                    {rating}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default ReviewCard;
