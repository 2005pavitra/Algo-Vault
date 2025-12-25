import React, { useState } from 'react';
import CodeViewer from './CodeViewer';

const ReviewCard = ({ problem }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto my-6 border border-gray-100">
            <h3 className="text-xl font-bold mb-2 text-gray-800">{problem.title}</h3>
            <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                    {problem.platform}
                </span>
            </div>

            <div className="relative">
                {/* Blur container */}
                <div className={`transition-all duration-300 ${revealed ? '' : 'blur-md select-none pointer-events-none'}`}
                    style={{ minHeight: '300px' }}>
                    <CodeViewer code={problem.code} />
                </div>

                {!revealed && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                            onClick={() => setRevealed(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105"
                        >
                            Reveal Solution
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                    Next Review: <span className="font-semibold">{new Date(problem.srsData.nextReviewDate).toLocaleDateString()}</span>
                </p>
                {revealed && (
                    <div className="flex gap-3 animate-fade-in-up">
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow transition">Fail</button>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded shadow transition">Hard</button>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow transition">Good</button>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow transition">Easy</button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ReviewCard;
