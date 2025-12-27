import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-300">
            <div className="relative flex items-center justify-center">
                {/* Breathing Glow Effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full w-32 h-32"
                />

                {/* Logo with slight float */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Logo className="scale-150" />
                </motion.div>
            </div>
        </div>
    );
};

export default Loader;
