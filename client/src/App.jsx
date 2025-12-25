import { useState, useEffect } from 'react'
import axios from 'axios';
import Heatmap from './components/Heatmap'
import ReviewCard from './components/ReviewCard'

function App() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [reviewProblems, setReviewProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  useEffect(() => {
    // Fetch heatmap data from our backend
    axios.get('http://localhost:5000/api/heatmap/2005pavitra')
      .then(res => {
        console.log("Heatmap data:", res.data);
        setHeatmapData(res.data);
      })
      .catch(err => {
        console.error(err);
        // Fallback dummy data for visual verification if server fails or user invalid
        setHeatmapData([
          { date: '2025-01-01', count: 2 },
        ]);
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
  const currentProblem = reviewProblems.length > 0
    ? reviewProblems[currentProblemIndex]
    : null;

  const handleNextProblem = () => {
    if (currentProblemIndex < reviewProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
    } else {
      alert("Review session complete!");
      // Reset to start or clear? For now reset
      setCurrentProblemIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">

      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Algo-Vault
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow">Add Problem</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Hero / Stats Section */}
        <section>
          <Heatmap data={heatmapData} />
        </section>

        {/* Review Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Review Session</h2>
              <p className="text-gray-500 mt-1">
                You have <span className="font-bold text-indigo-600">{reviewProblems.length}</span> problems due for review today.
              </p>
            </div>
            <button className="mt-4 md:mt-0 bg-white border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition">
              Skip Session
            </button>
          </div>

          {currentProblem ? (
            <div className="transition-all duration-500 ease-in-out">
              <ReviewCard problem={currentProblem} key={currentProblem._id || currentProblem.title} />
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextProblem}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold px-6 py-2 rounded-full hover:bg-indigo-50 transition"
                >
                  Next Problem
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
              <p className="mt-1 text-gray-500">No problems due for review right now. Great job!</p>
            </div>
          )}
        </section>

      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Algo-Vault. Built for competitive programmers.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
