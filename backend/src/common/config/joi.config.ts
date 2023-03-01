import * as Joi from 'joi';

export const joi = Joi.object({
  ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .default('dvelopment'),
  PORT: Joi.number().default(8000),
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASSWORD: Joi.string().required(),
  DEV_DB_USERNAME: Joi.string().required(),
  DEV_DB_PASSWORD: Joi.string().required(),
  DEV_DB_DATABASE: Joi.string().required(),
  DEV_DB_HOST: Joi.string().required(),
  DEV_DB_PORT: Joi.string().required(),
  ACCESS_KEY: Joi.string().required(),
  REFRESH_KEY: Joi.string().required(),
});
