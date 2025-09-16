module.exports = {
  apps: [{
    name: 'tech-blog',
    script: 'npm',
    args: 'start',
    cwd: '/opt/tech-blog',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/tech-blog/error.log',
    out_file: '/var/log/tech-blog/out.log',
    log_file: '/var/log/tech-blog/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    min_uptime: '10s',
    max_restarts: 5
  }]
};