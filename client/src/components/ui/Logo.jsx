import React from "react";

export const Logo = ({ className }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Outer Hexagon/Shape Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-blue-500/20 blur-xl rounded-full" />

            {/* Main Logo Container */}
            <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-2xl"
            >
                {/* Defs for Gradients */}
                <defs>
                    <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
                        <stop offset="50%" stopColor="#a855f7" /> {/* Purple */}
                        <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
                    </linearGradient>
                    <linearGradient id="logo-gradient-dark" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#67e8f9" />
                        <stop offset="100%" stopColor="#d8b4fe" />
                    </linearGradient>
                </defs>

                {/* Abstract Vault/Code Shape */}
                <path
                    d="M24 4L6.67949 14V34L24 44L41.3205 34V14L24 4Z"
                    fill="url(#logo-gradient)"
                    fillOpacity="0.2"
                    stroke="url(#logo-gradient)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M24 12V24M24 24L14 30M24 24L34 30"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-md"
                />
                <circle cx="24" cy="12" r="2" fill="white" />
                <circle cx="14" cy="30" r="2" fill="white" />
                <circle cx="34" cy="30" r="2" fill="white" />
            </svg>
        </div>
    );
};
