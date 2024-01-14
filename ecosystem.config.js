module.exports = {
  apps: [
    {
      name: 'ponbook',
      script: './server.js',
      instances: '2',
      exec_mode: 'cluster',
      autorestart: true,
    },
    {
      name: 'queue',
      script: 'npm',
      instances: '1',
      autorestart: true,
      args: 'run start:queue',
    },
  ],
}
