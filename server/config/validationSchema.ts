import * as Joi from 'joi';

export const validationSchema = Joi.object({
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PWD: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
  PORT: Joi.string().required(),

  ACCESS_JWT_SECRET: Joi.string().required(),
  REFRESH_JWT_SECRET: Joi.string().required(),
  ACCESS_JWT_EXPIRATION: Joi.string().required(),
  REFRESH_JWT_EXPIRATION: Joi.string().required(),
  ACCESS_JWT_TOKEN: Joi.string().required(),
  REFRESH_JWT_TOKEN: Joi.string().required(),

  JWT_ISSUER: Joi.string().required(),

  DEV_DOMAIN: Joi.string().required(),

  MAIL_USER: Joi.string().required(),
  MAIL_PW: Joi.string().required(),
  MAIL_ADDRESS: Joi.string().required(),

  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
});
