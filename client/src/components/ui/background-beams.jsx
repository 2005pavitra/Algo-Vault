"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BackgroundBeams = ({ className }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 z-0 flex rounded-3xl items-center justify-center bg-transparent pointer-events-none",
                className
            )}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-indigo-500/10 blur-[10rem] rounded-full" />
        </div>
    );
};
