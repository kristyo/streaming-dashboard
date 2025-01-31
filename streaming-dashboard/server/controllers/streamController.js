const { exec } = require('child_process');
const path = require('path');

exports.startStream = async (req, res) => {
  try {
    const scriptPath = path.join(__dirname, '../../scripts/stream_manager.sh');
    
    exec(`${scriptPath} start`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ 
          status: 'error',
          message: `Error starting stream: ${error.message}`
        });
      }
      
      res.json({
        status: 'success',
        message: 'Stream started successfully',
        pid: parseInt(stdout.trim())
      });
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

exports.getStreamStatus = async (req, res) => {
  try {
    // Implement logic to check running processes
    const status = await checkStreamStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
};