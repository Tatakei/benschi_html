#!/bin/bash

VENV_PYTHON="/home/tatakei/atlas/projects/python/benschi/venv/bin/python"
APP_PATH="/home/tatakei/atlas/projects/python/benschi/main.py"

echo "Starting Flask Auto-restarter..."
echo "[CTRL+C] to stop the loop."

while true; do
  $VENV_PYTHON $APP_PATH

  echo "---------------------------"
  echo "App crashed or failed"
  echo "---------------------------"
  sleep 1
done