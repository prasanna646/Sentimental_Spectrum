import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const HistoryPage = () => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchHistory = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Not authenticated');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5005/api/search-history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setSearchHistory(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch search history');
                setIsLoading(false);
            }
        };

        fetchSearchHistory();
    }, []);

    // If not logged in, redirect to login
    if (!localStorage.getItem('isLoggedIn')) {
        return <Navigate to="/login" />;
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading search history...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {searchHistory.length === 0 ? (
                <div className="text-gray-500">No search history found.</div>
            ) : (
                <div className="space-y-4 p-10">
                    {searchHistory.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-l font-semibold text-gray-500 ">
                                        <strong className='text-gray-700'>Search URL: </strong><span className="ml-2  break-all">
                                            {item.searchUrl}
                                        </span>

                                    </h2>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(item.timestamp).toLocaleString()}
                                </span>
                            </div>

                            {/* Parsing and displaying search response */}
                            {item.searchResponse && (
                                <div className="space-y-2">
                                    <div>
                                        <strong className="text-gray-700">Key Phrases:</strong>
                                        <p className="text-gray-600">
                                            {item.searchResponse.keyphrases?.join(', ') || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <strong className="text-gray-700">Sentiment:</strong>
                                        <p className={`font-medium`}>
                                            {item.searchResponse.overall_sentiment}
                                        </p>
                                    </div>
                                    <div>
                                        <strong className="text-gray-700">Summary:</strong>
                                        <p className="text-gray-600">
                                            {item.searchResponse.summary || 'No summary available'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
