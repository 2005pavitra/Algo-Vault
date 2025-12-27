"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "../../utils/cn";

export const SparklesCore = ({
    id,
    className,
    background,
    minSize,
    maxSize,
    particleDensity,
    particleColor,
    particleOffsetTop,
    particleOffsetBottom,
}) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        setInit(true);
    }, []);

    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={cn("opacity-0", className)}
        >
            {/* Simple Canvas implementation placeholder - replacing full particle engine for stability/speed */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {init && [...Array(particleDensity || 50)].map((_, i) => (
                    <motion.span
                        key={i}
                        className="absolute rounded-full bg-white"
                        initial={{
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            scale: Math.random(),
                            opacity: Math.random(),
                        }}
                        animate={{
                            top: [
                                Math.random() * 100 + "%",
                                Math.random() * 100 + "%"
                            ],
                            opacity: [Math.random(), 0, Math.random()],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            width: Math.random() * (maxSize || 2) + (minSize || 1) + "px",
                            height: Math.random() * (maxSize || 2) + (minSize || 1) + "px",
                            backgroundColor: particleColor || "#FFFFFF",
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
};
