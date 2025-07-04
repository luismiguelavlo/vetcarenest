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
};
