module.exports = {
  apps: [
    {
      name: 'ponbook',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}
