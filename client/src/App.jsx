import { useState, useEffect } from 'react'
import axios from 'axios';
import Heatmap from './components/Heatmap'
import ReviewCard from './components/ReviewCard'

function App() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [currentProblem, setCurrentProblem] = useState({
    title: "1. Two Sum",
    platform: "LeetCode",
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    srsData: {
      nextReviewDate: new Date(),
      interval: 1
    }
  });

  useEffect(() => {
    // Fetch heatmap data from our backend
    // Replace 'pavitra' with dynamic username later
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
          { date: '2025-01-05', count: 5 },
          { date: '2025-01-10', count: 12 },
        ]);
      });
  }, []);

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
              <p className="text-gray-500 mt-1">You have <span className="font-bold text-indigo-600">1</span> problem due for review today.</p>
            </div>
            <button className="mt-4 md:mt-0 bg-white border border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-50 transition">
              Skip Session
            </button>
          </div>

          <ReviewCard problem={currentProblem} />
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
