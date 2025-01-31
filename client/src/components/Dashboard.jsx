import React, { useState, useEffect } from 'react';
import { FiSettings, FiPlayCircle, FiStopCircle } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const res = await axios.get('/api/streams');
      setStreams(res.data);
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const handleStreamControl = async (action) => {
    setLoading(true);
    try {
      await axios.post(`/api/stream/${action}`);
      setTimeout(fetchStreams, 2000);
    } catch (error) {
      console.error(`Error ${action} stream:`, error);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1><FiSettings /> Streaming Controller</h1>
      </div>

      <div className="stream-grid">
        {streams.map((stream, index) => (
          <div key={index} className="stream-card">
            <div className="platform-logo">{stream.platform}</div>
            <div className="stream-info">
              <h3>{stream.name}</h3>
              <div className={`status ${stream.status}`}>
                {stream.status.toUpperCase()}
              </div>
              <div className="stats">
                <span>Uptime: {stream.uptime}</span>
                <span>Bitrate: {stream.bitrate}kbps</span>
              </div>
            </div>
            <div className="controls">
              <button 
                onClick={() => handleStreamControl('start')}
                disabled={stream.status === 'running'}
              >
                <FiPlayCircle /> Start
              </button>
              <button
                onClick={() => handleStreamControl('stop')}
                disabled={stream.status === 'stopped'}
              >
                <FiStopCircle /> Stop
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;