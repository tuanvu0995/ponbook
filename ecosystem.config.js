module.exports = {
  apps: [
    {
      script: './server.js',
      instances: '3',
      exec_mode: 'cluster',
      autorestart: true,
    },
    {
      name: 'queue',
      script: 'node ace queue:listen',
      instances: '1',
      autorestart: true,
    },
  ],
}
