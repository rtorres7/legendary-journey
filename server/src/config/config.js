// const dotenv = require('dotenv');
const path = require("path");
const Joi = require("joi");

// dotenv.config({ path: path.join(__dirname, '../../.env') });
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
  mongoose: {
    url: envVars.MONGO_DATABASE_URL,
  },
  oauth: {
    id: envVars.MXS_OAUTH_ID,
    secret: envVars.MXS_OAUTH_SECRET,
    caCerts: envVars.NODE_EXTRA_CA_CERTS,
  },
};
