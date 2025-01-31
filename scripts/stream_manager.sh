#!/bin/bash

# Konfigurasi Stream
CONFIG_FILE="/etc/streaming/config.json"
LOG_DIR="/var/log/streaming"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Fungsi untuk memulai stream
start_stream() {
  local platform=$1
  local rtmp_url=$2
  local pid_file="${LOG_DIR}/${platform}.pid"
  
  ffmpeg -hide_banner -loglevel warning \
    -stream_loop -1 -re -i "input.mp4" \
    -c:v libx264 -preset veryfast \
    -vf "scale=1280:720" -b:v 3000k \
    -c:a aac -b:a 128k \
    -f flv "$rtmp_url" > "${LOG_DIR}/${platform}_${TIMESTAMP}.log" 2>&1 &
  
  echo $! > "$pid_file"
}

# Fungsi untuk menghentikan stream
stop_stream() {
  local platform=$1
  local pid_file="${LOG_DIR}/${platform}.pid"
  
  if [ -f "$pid_file" ]; then
    kill -9 $(cat "$pid_file")
    rm "$pid_file"
  fi
}

# Main command handler
case $1 in
  start)
    # Baca konfigurasi dari file
    jq -c '.streams[]' "$CONFIG_FILE" | while read stream; do
      platform=$(echo "$stream" | jq -r '.platform')
      rtmp_url=$(echo "$stream" | jq -r '.rtmp_url')
      start_stream "$platform" "$rtmp_url"
    done
    ;;
  stop)
    jq -r '.streams[].platform' "$CONFIG_FILE" | while read platform; do
      stop_stream "$platform"
    done
    ;;
  *)
    echo "Usage: $0 {start|stop}"
    exit 1
    ;;
esac