import React, { useState } from 'react';

const NoSQLToSQLBackup = () => {
  const [backupStatus, setBackupStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleBackup = async () => {
    setBackupStatus('loading');
    setMessage('Starting backup process...');
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // This is where you'd call your actual backup API
      const response = await fetch('http://localhost:3000/data/backup-nosql-to-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        setBackupStatus('success');
        setMessage(`Backup completed successfully! ${result.recordsProcessed || 'All'} records transferred.`);
      } else {
        throw new Error(`Backup failed: ${response.statusText}`);
      }
    } catch (error) {
      setBackupStatus('error');
      setMessage(`Backup failed: ${error.message}`);
      setProgress(0);
    }
  };

  const resetStatus = () => {
    setBackupStatus('idle');
    setMessage('');
    setProgress(0);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
          <span className="text-white text-2xl">🗄️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Backup</h2>
        <p className="text-gray-600">Backup NoSQL data to SQL database</p>
      </div>

      <div className="space-y-4">
        {/* Main Backup Button */}
        <button
          onClick={handleBackup}
          disabled={backupStatus === 'loading'}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            backupStatus === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : backupStatus === 'success'
              ? 'bg-green-600 hover:bg-green-700'
              : backupStatus === 'error'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {backupStatus === 'loading' && <span className="animate-spin inline-block mr-2">⟳</span>}
          {backupStatus === 'success' && <span className="mr-2">✓</span>}
          {backupStatus === 'error' && <span className="mr-2">⚠</span>}
          {backupStatus === 'idle' && <span className="mr-2">⬇</span>}
          
          {backupStatus === 'loading' && 'Backing up...'}
          {backupStatus === 'success' && 'Backup Complete'}
          {backupStatus === 'error' && 'Backup Failed'}
          {backupStatus === 'idle' && 'Start Backup'}
        </button>

        {/* Progress Bar */}
        {backupStatus === 'loading' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            backupStatus === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : backupStatus === 'error'
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {/* Reset Button */}
        {(backupStatus === 'success' || backupStatus === 'error') && (
          <button
            onClick={resetStatus}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Start New Backup
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Backup Process:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Connects to NoSQL database</li>
          <li>• Transforms data structure</li>
          <li>• Migrates to SQL database</li>
          <li>• Validates data integrity</li>
        </ul>
      </div>
    </div>
  );
};

export default NoSQLToSQLBackup;