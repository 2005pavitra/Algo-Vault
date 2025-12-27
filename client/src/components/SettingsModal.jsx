import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_URL from '../utils/api';

const SettingsModal = ({ isOpen, onClose }) => {
    const [leetcodeUsername, setLeetcodeUsername] = useState('');
    const [leetcodeSession, setLeetcodeSession] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You are not logged in.");
                return;
            }
            await axios.post(`${API_URL}/leetcode/credentials`,
                { leetcodeUsername, leetcodeSession },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert('Credentials saved successfully!');
            onClose();
        } catch (error) {
            console.error('Error saving credentials:', error);
            alert('Failed to save credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl shadow-indigo-500/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-neutral-400 text-sm font-medium mb-2">LeetCode Username</label>
                        <input
                            type="text"
                            value={leetcodeUsername}
                            onChange={(e) => setLeetcodeUsername(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="e.g. pavitra2005"
                        />
                    </div>
                    <div>
                        <label className="block text-neutral-400 text-sm font-medium mb-2">LeetCode Session Cookie (Optional)</label>
                        <input
                            type="password"
                            value={leetcodeSession}
                            onChange={(e) => setLeetcodeSession(e.target.value)}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Optional: Paste LEETCODE_SESSION for private data"
                        />
                        <p className="text-xs text-neutral-500 mt-2">
                            Only required if you want to sync private submission history.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : 'Save Username'}
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
