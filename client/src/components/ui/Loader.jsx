import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300">
            <div className="relative flex items-center justify-center h-32 w-32">
                {/* Outer rotating ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500/30 w-full h-full"
                />
                {/* Inner faster rotating ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-500/50 w-[calc(100%-16px)] h-[calc(100%-16px)]"
                />

                {/* Center Logo */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 z-10"
                >
                    <span className="text-white font-bold text-2xl">AV</span>
                </motion.div>
            </div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-neutral-400 text-sm font-medium tracking-widest uppercase animate-pulse"
            >
                Loading Algo-Vault...
            </motion.p>
        </div>
    );
};

export default Loader;
