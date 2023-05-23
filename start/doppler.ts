import { execSync } from 'child_process'
import dotenv from 'dotenv'
dotenv.config()

export function loadEnv() {
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

export const doppler = { loadEnv }
