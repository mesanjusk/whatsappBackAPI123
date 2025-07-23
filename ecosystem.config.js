module.exports = {
  apps: [{
    name: 'baileys-enterprise',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
