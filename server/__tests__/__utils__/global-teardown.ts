import {
  ElasticSearchExtension, MinioExtension,
  MongoExtension,
  PostgresExtension
} from "@kiwiproject/kiwi-test-js";

async function globalJestTeardown() {
  console.log("Stopping Postgres");
  const postgres = PostgresExtension.stopPostgresContainer().then(() => console.log("Postgres stopped"));

  console.log("Stopping Mongo");
  const mongo = MongoExtension.stopMongoContainer().then(() => console.log("Mongo stopped"));

  console.log("Stopping Elastic Search");
  const elasticSearch = ElasticSearchExtension.stopElasticSearchContainer().then(() => console.log("Elastic Search stopped"));

  console.log("Stopping Minio");
  const minio = MinioExtension.stopMinioContainer().then(() => console.log("Minio stopped"));

  await Promise.all([postgres, mongo, elasticSearch, minio]).then(() => {
    console.log("All test containers stopped");
  });
}

export default globalJestTeardown;
