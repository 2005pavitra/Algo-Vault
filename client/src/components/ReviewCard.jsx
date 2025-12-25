import React, { useState } from 'react';
import CodeViewer from './CodeViewer';

const ReviewCard = ({ problem }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-3xl mx-auto my-8 transition-transform hover:shadow-xl">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <div>
                    <span className={`inline-block text-xs font-bold px-2 py-1 rounded mb-1 bg-gray-200 text-gray-700`}>
                        {problem.platform}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">{problem.title}</h3>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Next Review</p>
                    <p className="text-sm font-medium text-indigo-600">
                        {new Date(problem.srsData.nextReviewDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative bg-gray-900">
                {/* Blur container */}
                <div className={`transition-all duration-500 ease-in-out ${revealed ? 'filter-none opacity-100' : 'blur-lg opacity-50 select-none pointer-events-none'}`}
                    style={{ minHeight: '300px' }}>
                    <CodeViewer code={problem.code} />
                </div>

                {!revealed && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900/30 backdrop-blur-[2px]">
                        <p className="text-white mb-4 font-medium text-lg shadow-black drop-shadow-md">Ready to review?</p>
                        <button
                            onClick={() => setRevealed(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 focus:outline-none ring-4 ring-indigo-500/30"
                        >
                            Reveal Solution
                        </button>
                    </div>
                )}
            </div>

            {/* Action Footer */}
            {revealed && (
                <div className="p-6 bg-white border-t border-gray-100 animate-slide-up">
                    <p className="text-center text-gray-500 mb-4 text-sm font-medium">How difficult was this problem?</p>
                    <div className="flex justify-center gap-4">
                        <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded-lg transition border border-red-200">
                            Again (Fail)
                        </button>
                        <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-2 px-4 rounded-lg transition border border-orange-200">
                            Hard
                        </button>
                        <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-4 rounded-lg transition border border-green-200">
                            Good
                        </button>
                        <button className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-2 px-4 rounded-lg transition border border-blue-200">
                            Easy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ReviewCard;
