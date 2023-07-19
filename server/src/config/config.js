const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
const fs = require("fs");

let envPath = path.join(__dirname, "../../.env");
if (process.env.CONFIG_OVERRIDE != undefined) {
  envPath += "." + process.env.CONFIG_OVERRIDE;
} else if (process.env.NODE_ENV === "test") {
  envPath += ".test";
}
console.log(`config:  loading ${envPath}`);
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().default("development"), // .valid("production", "development", "test").required(),
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

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mxs: {
    env: envVars.MXS_ENV,
    baseUri: envVars.MXS_BASE_URI,
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
    endpoint: envVars.MINIO_ENDPOINT,
    port: envVars.MINIO_PORT,
    useSsl: envVars.MINIO_USE_SSL,
    accessKey: envVars.MINIO_ACCESS_KEY,
    secretKey: envVars.MINIO_SECRET_KEY,
  },
};
