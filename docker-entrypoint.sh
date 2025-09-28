#!/bin/sh
set -e

# Environment variables with defaults
NGINX_PORT=${NGINX_PORT:-3000}
NGINX_WORKER_PROCESSES=${NGINX_WORKER_PROCESSES:-auto}
NGINX_WORKER_CONNECTIONS=${NGINX_WORKER_CONNECTIONS:-1024}

echo "🚀 Starting AI Çözümler application..."
echo "📊 Environment: ${NODE_ENV:-production}"
echo "🌐 Port: ${NGINX_PORT}"
echo "👥 Worker Processes: ${NGINX_WORKER_PROCESSES}"
echo "🔗 Worker Connections: ${NGINX_WORKER_CONNECTIONS}"

# Update nginx configuration with environment variables
sed -i "s/listen 3000;/listen ${NGINX_PORT};/g" /etc/nginx/conf.d/default.conf
sed -i "s/listen \[::\]:3000;/listen [::]:${NGINX_PORT};/g" /etc/nginx/conf.d/default.conf
sed -i "s/worker_processes auto;/worker_processes ${NGINX_WORKER_PROCESSES};/g" /etc/nginx/nginx.conf
sed -i "s/worker_connections 1024;/worker_connections ${NGINX_WORKER_CONNECTIONS};/g" /etc/nginx/nginx.conf

# Create nginx directories if they don't exist
mkdir -p /var/cache/nginx/client_temp
mkdir -p /var/cache/nginx/proxy_temp
mkdir -p /var/cache/nginx/fastcgi_temp
mkdir -p /var/cache/nginx/uwsgi_temp
mkdir -p /var/cache/nginx/scgi_temp

# Test nginx configuration
echo "🔍 Testing nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration is invalid"
    exit 1
fi

# Create health check file
echo "healthy" > /usr/share/nginx/html/health

# Log application info
echo "📝 Application build info:"
if [ -f "/usr/share/nginx/html/build-info.json" ]; then
    cat /usr/share/nginx/html/build-info.json
else
    echo '{"version":"unknown","build_date":"unknown","git_commit":"unknown"}' > /usr/share/nginx/html/build-info.json
fi

echo "🎉 Starting nginx server..."

# Execute the main command
exec "$@"
