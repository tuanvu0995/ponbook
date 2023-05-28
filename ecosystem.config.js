module.exports = {
  apps: [
    {
      name: 'ms5-server',
      script: 'node -r dotenv/config main.js',
      instances: '1',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
