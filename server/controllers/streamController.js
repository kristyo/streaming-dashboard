const { exec } = require('child_process');
const path = require('path');
const Stream = require('../models/Stream');

exports.startStream = async (req, res) => {
  try {
    const { platform, rtmpUrl, resolution, bitrate } = req.body;
    
    const stream = new Stream({
      platform,
      rtmpUrl,
      status: 'starting',
      pid: null
    });
    
    await stream.save();

    const scriptPath = path.resolve(__dirname, '../../scripts/stream_manager.sh');
    const logPath = path.resolve(__dirname, '../../logs/stream.log');

    exec(
      `${scriptPath} start "${platform}" "${rtmpUrl}" ${resolution} ${bitrate} >> ${logPath} 2>&1 &`,
      (error, stdout, stderr) => {
        if (error) throw error;
        
        stream.pid = stdout.trim();
        stream.status = 'running';
        stream.save();
        
        res.json({
          status: 'success',
          message: 'Stream started',
          pid: stream.pid
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStreamStatus = async (req, res) => {
  try {
    const streams = await Stream.find();
    const status = await Stream.getSystemStatus();
    res.json({ streams, system: status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};