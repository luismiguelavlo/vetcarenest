import 'dotenv/config';
import * as joi from 'joi';

interface EnvVar {
  PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  JWT_SECRET: string;

  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
  AWS_REGION: string;
  AWS_BUCKET_NAME: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_USERNAME: joi.string().required(),
    DATABASE_PASSWORD: joi.string().required(),
    DATABASE_HOST: joi.string().required(),
    DATABASE_PORT: joi.number().required(),
    DATABASE_NAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),

    AWS_ACCESS_KEY: joi.string().required(),
    AWS_SECRET_KEY: joi.string().required(),
    AWS_REGION: joi.string().required(),
    AWS_BUCKET_NAME: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVar = value;

export const envs = {
  port: envVars.PORT,
  database_username: envVars.DATABASE_USERNAME,
  database_password: envVars.DATABASE_PASSWORD,
  database_host: envVars.DATABASE_HOST,
  database_port: envVars.DATABASE_PORT,
  database_name: envVars.DATABASE_NAME,
  jwt_secret: envVars.JWT_SECRET,

  aws_access_key: envVars.AWS_ACCESS_KEY,
  aws_secret_key: envVars.AWS_SECRET_KEY,
  aws_region: envVars.AWS_REGION,
  aws_bucket_name: envVars.AWS_BUCKET_NAME,
};
