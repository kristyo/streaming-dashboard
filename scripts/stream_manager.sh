#!/bin/bash

# Parameter handling
ACTION=$1
PLATFORM=$2
RTMP_URL=$3
RESOLUTION=$4
BITRATE=$5

# Path configuration
LOG_DIR="/var/log/streaming"
PID_DIR="/var/run/streaming"

# Fungsi utama
case $ACTION in
  start)
    mkdir -p $LOG_DIR $PID_DIR
    ffmpeg -hide_banner -loglevel warning \
      -stream_loop -1 -re -i input.mp4 \
      -c:v libx264 -preset veryfast \
      -vf "scale=$RESOLUTION" -b:v ${BITRATE}k \
      -c:a aac -b:a 128k \
      -f flv "$RTMP_URL" > "${LOG_DIR}/${PLATFORM}.log" 2>&1 &
    
    echo $! > "${PID_DIR}/${PLATFORM}.pid"
    ;;
    
  stop)
    if [ -f "${PID_DIR}/${PLATFORM}.pid" ]; then
      kill -9 $(cat "${PID_DIR}/${PLATFORM}.pid")
      rm "${PID_DIR}/${PLATFORM}.pid"
    fi
    ;;
    
  *)
    echo "Usage: $0 {start|stop} platform rtmp_url resolution bitrate"
    exit 1
    ;;
esac