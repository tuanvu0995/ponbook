import { SentryConfig } from '@ioc:Adonis/Addons/Sentry'
import Env from '@ioc:Adonis/Core/Env'

export default {
  dsn: Env.get('SENTRY_DSN'),
  enabled: Env.get('NODE_ENV') === 'production',
  sampleRate: Env.get('NODE_ENV') === 'production' ? 1 : 0.25,
} as SentryConfig
