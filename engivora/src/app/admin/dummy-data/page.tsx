"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DummyDataManagement() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInsertDummyData = async (type: string) => {
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      const response = await fetch(`/api/dummy-data?type=${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || `Dummy ${type} data inserted successfully!`);
        // Refresh the page to show updated data
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setError(data.error || `Failed to insert dummy ${type} data`);
      }
    } catch (err) {
      setError(`Network error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDummyData = async (type: string) => {
    try {
      const response = await fetch(`/api/dummy-data?type=${type}`);
      const data = await response.json();
      
      if (response.ok) {
        // Open in new tab to show JSON data
        const newWindow = window.open();
        newWindow?.document.write(`
          <html>
            <head>
              <title>Dummy ${type} Data</title>
              <style>
                body { font-family: monospace; padding: 20px; }
                pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
              </style>
            </head>
            <body>
              <h1>Dummy ${type} Data</h1>
              <pre>${JSON.stringify(data.data, null, 2)}</pre>
            </body>
          </html>
        `);
        newWindow?.document.close();
      } else {
        setError(data.error || `Failed to fetch dummy ${type} data`);
      }
    } catch (err) {
      setError(`Network error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dummy Data Management</h1>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['exams', 'blogs', 'jobs', 'events'].map((type) => (
            <div key={type} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{type}</h2>
              <p className="text-gray-600 mb-6">
                Manage dummy {type} data for testing and development purposes.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleInsertDummyData(type)}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
                >
                  {loading ? 'Inserting...' : 'Insert Dummy Data'}
                </button>
                <button
                  onClick={() => handleViewDummyData(type)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                >
                  View Data
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">All Dummy Data</h2>
          <p className="text-gray-600 mb-6">
            View all dummy data across all content types.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => handleViewDummyData('')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
            >
              View All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}