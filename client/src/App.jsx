import { useState, useEffect } from 'react'
import axios from 'axios';
import Heatmap from './components/Heatmap'
import ReviewCard from './components/ReviewCard'

function App() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [reviewProblems, setReviewProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [theme, setTheme] = useState('light');

  // Theme Handling
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Fetch heatmap data from our backend
    axios.get('http://localhost:5000/api/heatmap/local')
      .then(res => {
        console.log("Heatmap data:", res.data);
        setHeatmapData(res.data);
      })
      .catch(err => {
        console.error(err);
        setHeatmapData([{ date: '2025-01-01', count: 2 }]);
      });

    // Fetch review problems
    axios.get('http://localhost:5000/api/problems/review')
      .then(res => {
        console.log("Review problems:", res.data);
        setReviewProblems(res.data);
      })
      .catch(err => console.error("Review fetch error:", err));
  }, []);

  // Derived state for current problem
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

  const handleSkipSession = () => {
    handleNextProblem();
  };

  const handleReview = (rating) => {
    if (!currentProblem) return;
    // Optimistic update
    handleNextProblem();
    axios.post(`http://localhost:5000/api/problems/${currentProblem._id}/review`, { rating })
      .then(res => console.log("Review recorded:", res.data))
      .catch(err => console.error("Error submitting review:", err));
  };

  const handleAddProblem = () => {
    alert("To add a problem, use the Algo-Vault Chrome Extension on LeetCode!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Algo-Vault
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button
                onClick={handleAddProblem}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow"
              >
                Add Problem
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Hero / Stats Section */}
        <section>
          <div className="dark:filter dark:invert-[.05]">
            {/* Quick hack for heatmap colors in dark mode, or better valid styles */}
            <Heatmap data={heatmapData} />
          </div>
        </section>

        {/* Review Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Review Session</h2>
              {/* Only show count if NOT session complete and HAVE problems */}
              {!isSessionComplete && reviewProblems.length > 0 && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  You have <span className="font-bold text-indigo-600 dark:text-indigo-400">{reviewProblems.length - currentProblemIndex}</span> problems due for review.
                </p>
              )}
            </div>

            {!isSessionComplete && reviewProblems.length > 0 && (
              <button
                onClick={handleSkipSession}
                className="mt-4 md:mt-0 bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
              >
                Skip This
              </button>
            )}
          </div>

          {isSessionComplete ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Session Complete!</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Great job! You've reviewed all your due problems for now. Come back later to keep your streak alive.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-8 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Refresh Dashboard
              </button>
            </div>
          ) : currentProblem ? (
            <div className="transition-all duration-500 ease-in-out">
              <ReviewCard
                problem={currentProblem}
                key={currentProblem._id || currentProblem.title}
                onReview={handleReview}
              />
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">No problems due for review right now. Great job!</p>
            </div>
          )}
        </section>

      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Algo-Vault. Built for competitive programmers.</p>
        </div>
      </footer>
    </div>
  )
}


export default App
  ```
