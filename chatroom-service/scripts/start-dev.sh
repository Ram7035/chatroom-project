#!/bin/bash

echo "🛑 Stopping any previous NGINX instances..."
nginx -s stop 2>/dev/null || true

echo "🚀 Starting NGINX load balancer..."
nginx -c $(pwd)/nginx/nginx-chat.conf

echo "🧠 Starting server on PORT 3000..."
PORT=3000 node src/index.js &

echo "🧠 Starting server on PORT 3001..."
PORT=3001 node src/index.js &

echo "✅ Load balancer running at http://localhost:8080"
