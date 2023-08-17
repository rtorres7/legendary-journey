import {
  PostgresExtension,
  MongoExtension,
  ElasticSearchExtension,
  MinioExtension
} from "@kiwiproject/kiwi-test-js";
import config from "../../src/config/config";

async function globalJestSetup() {
  console.time("All test containers started in");

  console.log("Starting Postgres");
  console.time("Postgres started in");
  const postgres = PostgresExtension.startPostgresContainer().then(() => console.timeEnd("Postgres started in"));

  console.log("Starting Mongo");
  console.time("Mongo started in");
  const mongo = MongoExtension.startMongoContainer().then(() => console.timeEnd("Mongo started in"));

  console.log("Starting Elastic Search");
  console.time("Elastic Search started in");
  const elasticSearch = ElasticSearchExtension.startElasticSearchContainer().then(() => console.timeEnd("Elastic Search started in"));

  console.log("Starting Minio");
  console.time("Minio started in");
  const minio = MinioExtension.startMinioContainer(config.minio.accessKey, config.minio.secretKey).then(() => console.timeEnd("Minio started in"));

  await Promise.all([postgres, mongo, elasticSearch, minio]).then(() => {
    console.timeEnd("All test containers started in");
  });
}

export default globalJestSetup;
