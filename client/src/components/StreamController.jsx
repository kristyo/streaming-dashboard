import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StreamController = () => {
  const [streams, setStreams] = useState([]);
  const [newStream, setNewStream] = useState({
    platform: 'youtube',
    rtmpUrl: '',
    resolution: '1280x720',
    bitrate: '3000'
  });

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await axios.get('/api/streams');
      setStreams(response.data.streams);
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const handleStartStream = async () => {
    try {
      await axios.post('/api/streams/start', newStream);
      fetchStreams();
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  return (
    <div className="stream-controller">
      <div className="stream-form">
        <select 
          value={newStream.platform}
          onChange={(e) => setNewStream({...newStream, platform: e.target.value})}
        >
          <option value="youtube">YouTube</option>
          <option value="twitch">Twitch</option>
          <option value="facebook">Facebook</option>
        </select>
        
        <input
          type="text"
          placeholder="RTMP URL"
          value={newStream.rtmpUrl}
          onChange={(e) => setNewStream({...newStream, rtmpUrl: e.target.value})}
        />
        
        <button onClick={handleStartStream}>
          Start New Stream
        </button>
      </div>

      <div className="stream-list">
        {streams.map((stream) => (
          <div key={stream.id} className="stream-item">
            <div className="stream-platform">{stream.platform}</div>
            <div className="stream-status">{stream.status}</div>
            <div className="stream-controls">
              <button>Stop</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamController;