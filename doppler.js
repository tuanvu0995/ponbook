const { execSync } = require('child_process')
require('dotenv').config()

function loadEnv() {
  const fetchDopplerCLI = [
    'curl',
    '--connect-timeout 20',
    '--silent',
    '--request GET',
    '--url',
    `https://${process.env.DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`,
  ].join(' ')
  const dopplerSecrets = execSync(fetchDopplerCLI)

  process.env = {
    ...JSON.parse(dopplerSecrets.toString()),
    ...process.env,
  }
}

module.exports = { loadEnv }
