import dotenv from "dotenv";
import fs from "fs";
import Joi from "joi";
import path from "path";

let envPath: string;

// console.log(`DOTENV = ${process.env.DOTENV}`);
// console.log(`NODE_ENV = ${process.env.NODE_ENV}`);
// console.log(`MXS_ENV = ${process.env.MXS_ENV}`);

if (process.env.DOTENV) {
  envPath = path.join(__dirname, `../../env/${process.env.DOTENV}.env`);
} else if (process.env.NODE_ENV) {
  switch (process.env.NODE_ENV) {
    case "development":
      // local development
      envPath = path.join(__dirname, "../../env/development.env");
      break;
    case "test":
      // jest
      envPath = path.join(__dirname, "../../env/test.env");
      break;
    case "production":
      break;
    default:
      throw new Error(`unhandled NODE_ENV ${process.env.NODE_ENV}`);
  }
}

// console.log(`envPath ${envPath}`);

if (envPath) {
  if (fs.existsSync(envPath)) {
    // console.info(`config:  dotenv config ${envPath}`);
    dotenv.config({ path: envPath });
  } else {
    // console.info(`config:  dotenv file not found ${envPath}`);
  }
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().optional().allow(""), // .string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(3000),

    ES_URL: Joi.string().required().description("Elasticsearch URL"),
    MONGO_DATABASE_URL: Joi.string().required().description("Mongo Database URL"),
    POSTGRES_CONNECTION_URL: Joi.string().required().description("PostgreSQL URL"),

    MXS_ENV: Joi.string().required(), // Joi.string().valid('container', '?').required(),
    MXS_BASE_URI: Joi.string().required(),

    MXS_OAUTH_ID: Joi.string().required(),
    MXS_OAUTH_SECRET: Joi.string().required(),
    NODE_EXTRA_CA_CERTS: Joi.string().required(),

    MINIO_ENDPOINT: Joi.string().required(),
    MINIO_PORT: Joi.number().required(),
    MINIO_USE_SSL: Joi.boolean().default(true),
    MINIO_ACCESS_KEY: Joi.string().required(),
    MINIO_SECRET_KEY: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mxs: {
    env: envVars.MXS_ENV,
    baseUri: envVars.MXS_BASE_URI,
  },
  elasticsearch: {
    url: envVars.ES_URL,
  },
  mongodb: {
    url: envVars.MONGO_DATABASE_URL,
  },
  oauth: {
    id: envVars.MXS_OAUTH_ID,
    secret: envVars.MXS_OAUTH_SECRET,
    caCerts: envVars.NODE_EXTRA_CA_CERTS,
  },
  minio: {
    endPoint: envVars.MINIO_ENDPOINT,
    port: envVars.MINIO_PORT,
    useSsl: envVars.MINIO_USE_SSL,
    accessKey: envVars.MINIO_ACCESS_KEY,
    secretKey: envVars.MINIO_SECRET_KEY,
  },
};

export default config;
