module.exports = {
  apps: [
    {
      script: './server.js',
      instances: '2',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
