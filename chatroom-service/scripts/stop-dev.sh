#!/bin/bash

echo "🛑 Stopping servers and NGINX..."
pkill -f "PORT=3000"
pkill -f "PORT=3001"
nginx -s stop
