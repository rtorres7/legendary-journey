import { DockerComposeEnvironment, Wait } from "testcontainers";
import path from "path";
import {
  ElasticSearchExtension,
  MinioExtension,
  MongoExtension,
  PostgresExtension,
} from "@kiwiproject/kiwi-test-js";

async function globalJestSetup() {
  console.time("All test containers started in");

  const composeFilePath = path.resolve(__dirname, "../__utils__");
  const composeFile = "jest-compose.yml";

  const environment = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile,
  )
    .withWaitStrategy(
      "jest-postgres",
      Wait.forLogMessage(
        /.*database system is ready to accept connections.*/,
        2,
      ),
    )
    .withWaitStrategy("jest-mongo", Wait.forHealthCheck())
    .withWaitStrategy("jest-elastic", Wait.forHealthCheck())
    .withWaitStrategy(
      "jest-minio",
      Wait.forAll([Wait.forListeningPorts(), Wait.forLogMessage(/1 Online/)]),
    )
    .withNoRecreate()
    .up();

  console.timeEnd("All test containers started in");

  const postgresContainer = environment.getContainer("jest-postgres-1");
  PostgresExtension.setPostgresBaseUrl(
    postgresContainer.getHost(),
    postgresContainer.getMappedPort(5432),
  );

  const mongoContainer = environment.getContainer("jest-mongo-1");
  MongoExtension.setMongoBaseUrl(
    mongoContainer.getHost(),
    mongoContainer.getMappedPort(27017),
  );

  const elasticContainer = environment.getContainer("jest-elastic-1");
  ElasticSearchExtension.setElasticSearchUrl(
    elasticContainer.getHost(),
    elasticContainer.getMappedPort(9200),
  );

  const minioContainer = environment.getContainer("jest-minio-1");
  MinioExtension.setMinioPort(minioContainer.getMappedPort(9000));
  MinioExtension.setMinioHost(minioContainer.getHost());
}

export default globalJestSetup;
