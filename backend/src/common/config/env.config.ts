import { registerAs } from '@nestjs/config';

export const node = registerAs('node', () => ({
  env: process.env.ENVIRONMENT,
}));

export const main = registerAs('main', () => ({
  port: process.env.PORT || 8000,
  cors: process.env.CORS_ORIGIN_LIST
    ? process.env.CORS_ORIGIN_LIST.split(/,/g).map((origin) => origin.trim())
    : ['*'],
  cspOptions1: process.env.CSPOPTIONS1
    ? process.env.CSPOPTIONS1.split(/,/g).map((origin) => origin.trim())
    : [],
  cspOptions2: process.env.CSPOPTIONS2
    ? process.env.CSPOPTIONS1.split(/,/g).map((origin) => origin.trim())
    : [],
}));

export const swagger = registerAs('swagger', () => ({
  user: process.env.SWAGGER_USER,
  password: process.env.SWAGGER_PASSWORD,
}));

export const jwt = registerAs('jwt', () => ({
  access_key: process.env.ACCESS_KEY,
  refresh_key: process.env.REFRESH_KEY,
  sign_algorithm: process.env.SIGN_ALGORITHM,
  verify_algorithm: process.env.VERIFY_ALGORITHM.split(/,/g).map((origin) =>
    origin.trim(),
  ),
  issuer: process.env.ISSUER,
  audience: process.env.AUDIENCE,
}));

export const db = registerAs('db', () => ({
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_DATABASE,
  devhost: process.env.DEV_DB_HOST,
  prodhost: process.env.PROD_DB_HOST,
  port: process.env.DEV_DB_PORT,
  schema: process.env.DEV_DB_SCHEMA,
  secretkey: process.env.DEV_DB_SECRET_KEY,
}));

export const bull = registerAs('bull', () => ({
  devhost: process.env.DEV_QUEUE_HOST,
  prodhost: process.env.PROD_QUEUE_HOST,
  port: process.env.QUEUE_PORT,
}));

export const session = registerAs('session', () => ({
  secret: process.env.SESSION_SECRET,
}));
