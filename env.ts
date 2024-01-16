/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  APP_DOMAIN: Env.schema.string(),
  PB_APP_KEY: Env.schema.string(),
  CACHE_VIEWS: Env.schema.boolean(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  SESSION_DRIVER: Env.schema.string(),
  DB_CONNECTION: Env.schema.string(),
  MYSQL_HOST: Env.schema.string({ format: 'host' }),
  MYSQL_USER: Env.schema.string(),
  MYSQL_PASSWORD: Env.schema.string.optional(),
  MYSQL_DB_NAME: Env.schema.string(),
  DEBUG_SQL: Env.schema.boolean.optional(),
  LOCAL_UPLOAD_PATH: Env.schema.string(),
  REDIS_CONNECTION: Env.schema.string(),
  REDIS_HOST: Env.schema.string({ format: 'host' }),
  REDIS_PORT: Env.schema.number(),
  REDIS_PASSWORD: Env.schema.string.optional(),
  DOPPLER_TOKEN: Env.schema.string(),
  PAGINATION_LIMIT: Env.schema.number.optional(),
  QUEUE_REDIS_HOST: Env.schema.string({ format: 'host' }),
  QUEUE_REDIS_PORT: Env.schema.number(),
  QUEUE_REDIS_PASSWORD: Env.schema.string.optional(),
  MEILI_HOST: Env.schema.string(),
  MEILI_API_KEY: Env.schema.string(),
  TURNSTILE_SITE_KEY: Env.schema.string(),
  TURNSTILE_SECRET_KEY: Env.schema.string(),
  INFLUX_HOST: Env.schema.string(),
  INFLUX_API_KEY: Env.schema.string(),
  INFLUX_BUCKET: Env.schema.string(),
  INFLUX_ORG: Env.schema.string(),
})
