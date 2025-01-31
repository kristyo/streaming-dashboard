import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SystemMonitor = () => {
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    streams: 0
  });

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('system_stats', (data) => {
      setSystemStats({
        cpu: data.cpu.toFixed(1),
        memory: (data.memory / 1024 / 1024).toFixed(1), // Convert to MB
        streams: data.streams
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="system-monitor">
      <h3>Monitoring Sistem</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">CPU Usage</div>
          <div className="stat-value">{systemStats.cpu}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Memory Usage</div>
          <div className="stat-value">{systemStats.memory} MB</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Active Streams</div>
          <div className="stat-value">{systemStats.streams}</div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;