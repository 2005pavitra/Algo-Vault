import { useState, useEffect } from 'react'
import axios from 'axios';
import Heatmap from './components/Heatmap'
import ReviewCard from './components/ReviewCard'

function App() {
  const [heatmapData, setHeatmapData] = useState([]);
  // Dummy problem for demonstration
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
    axios.get('http://localhost:5000/api/heatmap/pavitra')
      .then(res => setHeatmapData(res.data))
      .catch(err => {
        console.error(err);
        // Fallback dummy data for visual verification if server fails
        setHeatmapData([
          { date: '2025-01-01', count: 2 },
          { date: '2025-01-05', count: 5 },
          { date: '2025-01-10', count: 12 },
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700">Algo-Vault</h1>
        <p className="text-center text-gray-500 mt-2">Spaced Repetition for Algorithms</p>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto space-y-12">

        <section>
          <Heatmap data={heatmapData} />
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Review Session</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
              Start New Session
            </button>
          </div>

          <ReviewCard problem={currentProblem} />
        </section>

      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        &copy; 2025 Algo-Vault
      </footer>
    </div>
  )
}

export default App
