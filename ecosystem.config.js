module.exports = {
  apps: [
    {
      script: './server.js',
      instances: '4',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
