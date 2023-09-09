import dotenv from "dotenv";
import fs from "fs";
import Joi from "joi";
import path from "path";

import logger from "./logger";

interface IConfig {
  nodeEnv: string;
  basePath: string;
  port: number;
  mxs: {
    env: string;
    baseUri: string;
  };
  elasticsearch: {
    url: string;
  };
  mongodb: {
    url: string;
  };
  oauth: {
    id: string;
    secret: string;
    caCerts: string;
    authorizationURL: string;
    tokenURL: string;
    callbackURL: string;
    scope: string;
    userInfoURL: string;
    strategy: string;
  };
  postgres: {
    url: string;
  };
  minio: {
    endPoint: string;
    port: number;
    useSsl: boolean;
    accessKey: string;
    secretKey: string;
    attachmentBucket: string;
  };
}

/**
 *
 */
export class ConfigLoader {
  private static config: any;

  public static getConfig(force = false): IConfig {
    if (force || !ConfigLoader.config) {
      const loader = new ConfigLoader();
      ConfigLoader.config = loader.loadConfig();
    }
    return ConfigLoader.config;
  }

  private loadConfig(): any {
    const envFile = this.findEnvFile();
    this.loadDotEnv(envFile);
    const env = this.validateEnv();
    return this.buildConfig(env);
  }

  /**
   * Locate .env based on runtime environment.
   * @returns .env file
   */
  private findEnvFile(): string {
    let envFile: string;
    if (process.env.DOTENV !== undefined) {
      const fileName = process.env.DOTENV
        ? `${process.env.DOTENV}.env`
        : ".env";
      envFile = path.join(__dirname, `../../env/${fileName}`);
    } else if (process.env.NODE_ENV) {
      switch (process.env.NODE_ENV) {
        case "development":
          // local development
          envFile = path.join(__dirname, "../../env/development.env");
          break;
        case "test":
          // jest
          envFile = path.join(__dirname, "../../env/test.env");
          break;
        case "production":
          // production, there should be no production .env file
          break;
        default:
          throw new Error(`unhandled NODE_ENV ${process.env.NODE_ENV}`);
      }
    }
    logger.info(`Config.findEnvFile:  envFile:${envFile}`);
    return envFile;
  }

  /**
   * Load .env file.
   */
  private loadDotEnv(envFile: string): void {
    if (envFile && fs.existsSync(envFile)) {
      logger.info(`Config.loadDotEnv:  loading envFile:${envFile}`);
      dotenv.config({ path: envFile });
    }
  }

  /**
   * Validate environment variables.
   * @returns environment variables
   */
  private validateEnv(): any {
    const schema = Joi.object()
      .keys({
        NODE_ENV: Joi.string().optional().allow(""), // .string().valid("production", "development", "test").required(),
        BASE_PATH: Joi.string().optional().default(""),
        PORT: Joi.number().default(3000),

        ES_URL: Joi.string().required().description("Elasticsearch URL"),
        MONGO_DATABASE_URL: Joi.string()
          .required()
          .description("Mongo Database URL"),
        POSTGRES_CONNECTION_URL: Joi.string()
          .required()
          .description("PostgreSQL URL"),

        MXS_ENV: Joi.string().required(), // Joi.string().valid('container', '?').required(),
        MXS_BASE_URI: Joi.string().required(),

        MXS_OAUTH_ID: Joi.string().required(),
        MXS_OAUTH_SECRET: Joi.string().required(),
        NODE_EXTRA_CA_CERTS: Joi.string().required(),
        MXS_OAUTH_AUTH_URL: Joi.string().required(),
        MXS_OAUTH_TOKEN_URL: Joi.string().required(),
        MXS_OAUTH_CALLBACK_URL: Joi.string().required(),
        MXS_OAUTH_SCOPES: Joi.string().required(),
        MXS_OAUTH_USER_INFO_URL: Joi.string().required().allow(""),
        MXS_OAUTH_STRATEGY: Joi.string().required(),

        MINIO_ENDPOINT: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        MINIO_USE_SSL: Joi.boolean().default(true),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_ATTACHMENT_BUCKET: Joi.string().required(),
      })
      .unknown();
    const { value, error } = schema
      .prefs({ errors: { label: "key" } })
      .validate(process.env);
    if (error) {
      throw new Error(`config validation error`, { cause: error });
    }
    return value;
  }

  private buildConfig(env: any): IConfig {
    return {
      nodeEnv: env.NODE_ENV,
      basePath: env.BASE_PATH,
      port: env.PORT,
      mxs: {
        env: env.MXS_ENV,
        baseUri: env.MXS_BASE_URI,
      },
      elasticsearch: {
        url: env.ES_URL,
      },
      mongodb: {
        url: env.MONGO_DATABASE_URL,
      },
      oauth: {
        id: env.MXS_OAUTH_ID,
        secret: env.MXS_OAUTH_SECRET,
        caCerts: env.NODE_EXTRA_CA_CERTS,
        authorizationURL: env.MXS_OAUTH_AUTH_URL,
        tokenURL: env.MXS_OAUTH_TOKEN_URL,
        callbackURL: env.MXS_OAUTH_CALLBACK_URL,
        scope: env.MXS_OAUTH_SCOPES.split(","),
        userInfoURL: env.MXS_OAUTH_USER_INFO_URL,
        strategy: env.MXS_OAUTH_STRATEGY,
      },
      postgres: {
        url: env.POSTGRES_CONNECTION_URL,
      },
      minio: {
        endPoint: env.MINIO_ENDPOINT,
        port: env.MINIO_PORT,
        useSsl: env.MINIO_USE_SSL,
        accessKey: env.MINIO_ACCESS_KEY,
        secretKey: env.MINIO_SECRET_KEY,
        attachmentBucket: env.MINIO_ATTACHMENT_BUCKET,
      },
    };
  }
}

export const config = ConfigLoader.getConfig();
export default config;
