import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  PORT: process.env.PORT,
  SWAGGER_USER: process.env.SWAGGER_USER,
  SWAGGER_PWD: process.env.SWAGGER_PWD,
}));

export const authConfig = registerAs('auth', () => ({
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  ACCESS_JWT_EXPIRATION: parseInt(process.env.ACCESS_JWT_EXPIRATION, 10),
  REFRESH_JWT_EXPIRATION: parseInt(process.env.REFRESH_JWT_EXPIRATION, 10),
  JWT_ISSUER: process.env.JWT_ISSUER,
  DEV_DOMAIN: process.env.DEV_DOMAIN,

  ACCESS_JWT_TOKEN: process.env.ACCESS_JWT_TOKEN,
  REFRESH_JWT_TOKEN: process.env.REFRESH_JWT_TOKEN,
}));

export const mailConfig = registerAs('mail', () => ({
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PW: process.env.MAIL_PW,
  MAIL_ADDRESS: process.env.MAIL_ADDRESS,
}));

export const awsConfig = registerAs('aws', () => ({
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_REGION: process.env.AWS_REGION,
}));
