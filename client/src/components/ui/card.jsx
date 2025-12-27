import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ className, children }) => {
    return (
        <div
            className={cn(
                "relative z-10 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 shadow-xl backdrop-blur-md",
                className
            )}
        >
            <div className="relative z-10 p-6">{children}</div>
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-pink-500/5 dark:from-indigo-500/10 dark:to-pink-500/10 pointer-events-none" />
        </div>
    );
};
