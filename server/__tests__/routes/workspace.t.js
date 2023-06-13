const { GenericContainer, PostgreSqlContainer } = require("testcontainers");
const {
  loadProductsIntoMongo,
  loadSavedProducts,
  loadCollections,
  loadCollectionProducts,
} = require("../__utils__/dataLoader");

const express = require("express");
const request = require("supertest");

const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");

describe("Workspace Routes", () => {
  let mongoContainer;
  let mongoUrl;
  let postgresContainer;
  let app;

  beforeAll(async () => {
    mongoContainer = await new GenericContainer("mongo")
      .withExposedPorts(27017)
      .start();

    mongoUrl = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(
      27017
    )}/mxms`;

    // Load products
    await loadProductsIntoMongo(mongoUrl);

    postgresContainer = await new PostgreSqlContainer().start();
    process.env.POSTGRES_CONNECTION_URL = postgresContainer.getConnectionUri();

    // Load Saved Products
    await loadSavedProducts(postgresContainer.getConnectionUri());
    await loadCollections(postgresContainer.getConnectionUri());
    await loadCollectionProducts(postgresContainer.getConnectionUri());

    app = express();
    app.use(express.json());

    const router = require("../../src/routes/workspace");
    app.use("/workspace", router);
  }, 70_000);

  beforeEach(async () => {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
    });
  });

  afterEach(() => {
    mongoose.connection.close();
  });

  afterAll(() => {
    mongoContainer.stop();
    postgresContainer.stop();
  });

  describe("GET /workspace/drafts", () => {
    it("should return draft products", () => {
      return request(app)
        .get("/workspace/drafts")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.length).toBe(1);
          expect(res.body[0].productNumber).toBe("WIReWIRe_sample_5");
        });
    });
  });

  describe("GET /workspace/recent", () => {
    it("should return recent posted products", () => {
      return request(app)
        .get("/workspace/recent")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.length).toBe(4);

          const ids = res.body.map((product) => product.productNumber);
          expect(ids).toStrictEqual([
            "WIReWIRe_sample_4",
            "WIReWIRe_sample_3",
            "WIReWIRe_sample_2",
            "WIReWIRe_sample_1",
          ]);
        });
    });
  });

  describe("GET /workspace/stats", () => {
    it("should return stats", () => {
      return request(app)
        .get("/workspace/stats")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.length).toBe(0);
        });
    });
  });

  describe("GET /workspace/products", () => {
    it("should return all my products", () => {
      return request(app)
        .get("/workspace/products")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(5);

          const ids = res.body.content.map((product) => product.productNumber);
          expect(ids).toStrictEqual([
            "WIReWIRe_sample_5",
            "WIReWIRe_sample_4",
            "WIReWIRe_sample_3",
            "WIReWIRe_sample_2",
            "WIReWIRe_sample_1",
          ]);
        });
    });
  });

  describe("GET /workspace/saved", () => {
    it("should return all saved products", () => {
      return request(app)
        .get("/workspace/saved")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(1);

          const ids = res.body.content.map(
            (savedProduct) => savedProduct.productId
          );
          expect(ids).toStrictEqual(["WIReWIRe_sample_1"]);
        });
    });
  });

  describe("PUT /workspace/saved/:productId", () => {
    it("should mark a product saved", () => {
      return request(app)
        .put("/workspace/saved/fooProduct")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.productId).toBe("fooProduct");
          expect(res.body.id).toBeGreaterThan(0);
        });
    });
  });

  describe("DELETE /workspace/saved/:productId", () => {
    it("should unmark a product saved", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const savedProductModel = require("../../src/models/saved_product");
      savedProductModel(sequelize);

      const existingProduct = await sequelize.models.SavedProduct.create({
        productId: "foobar",
        createdBy: 1,
      });

      return request(app)
        .delete(`/workspace/saved/${existingProduct.productId}`)
        .expect(204);
    });

    it("should return 404 when saved product is not found", async () => {
      return request(app).delete(`/workspace/saved/blahblah`).expect(404);
    });
  });

  describe("GET /workspace/collections", () => {
    it("should return all collections", () => {
      return request(app)
        .get("/workspace/collections")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.length).toBe(1);

          const ids = res.body.map((collection) => collection.name);
          expect(ids).toStrictEqual(["Sample Collection"]);
        });
    });
  });

  describe("POST /workspace/collections", () => {
    it("should create a collection", () => {
      return request(app)
        .post("/workspace/collections")
        .send({ name: "Should save" })
        .expect(200)
        .expect("Content-Type", /json/)
        .then(async (res) => {
          expect(res.body.name).toBe("Should save");
          expect(res.body.id).toBeGreaterThan(0);
        });
    });
  });

  describe("PUT /workspace/collections/:collectionId", () => {
    it("should update a collection", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const collectionModel = require("../../src/models/collection");
      collectionModel(sequelize);

      const existingCollection = await sequelize.models.Collection.findOne();

      return request(app)
        .put(`/workspace/collections/${existingCollection.id}`)
        .send({
          name: "Updated name",
          description: "Updated description",
          image: "Updated image",
        })
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.name).toBe("Updated name");
          expect(res.body.description).toBe("Updated description");
          expect(res.body.image).toBe("Updated image");
        });
    });

    it("should return 404 when collection is not found", async () => {
      return request(app)
        .put(`/workspace/collections/1000`)
        .send({ name: "Nope" })
        .expect(404);
    });
  });

  describe("DELETE /workspace/collections/:collectionId", () => {
    it("should delete a collection", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const collectionModel = require("../../src/models/collection");
      collectionModel(sequelize);

      const existingCollection = await sequelize.models.Collection.findOne();

      return request(app)
        .delete(`/workspace/collections/${existingCollection.id}`)
        .expect(204);
    });

    it("should return 404 when collection is not found", async () => {
      return request(app).delete(`/workspace/collections/1000`).expect(404);
    });
  });

  describe("GET /workspace/collections/:collectionId/products", () => {
    it("should return all products for a collection", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const collectionModel = require("../../src/models/collection");
      collectionModel(sequelize);

      const existingCollection = await sequelize.models.Collection.findOne();

      return request(app)
        .get(`/workspace/collections/${existingCollection.id}/products`)
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.length).toBe(1);

          const ids = res.body.map((savedProduct) => savedProduct.productId);
          expect(ids).toStrictEqual(["WIReWIRe_sample_1"]);
        });
    });

    it("should return 404 when collection is not found", async () => {
      return request(app)
        .delete(`/workspace/collections/1000/products`)
        .expect(404);
    });
  });

  describe("PUT /workspace/collections/:collectionId/products/:savedProductId", () => {
    it("should add a saved product to a collection", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const collectionModel = require("../../src/models/collection");
      collectionModel(sequelize);

      const existingCollection = await sequelize.models.Collection.findOne();

      const savedProductModel = require("../../src/models/saved_product");
      savedProductModel(sequelize);

      const savedProduct = await sequelize.models.SavedProduct.create({
        productId: "fooBar",
      });

      return request(app)
        .put(
          `/workspace/collections/${existingCollection.id}/products/${savedProduct.id}`
        )
        .expect(201);
    });

    it("should return 404 when collection is not found", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const savedProductModel = require("../../src/models/saved_product");
      savedProductModel(sequelize);

      const existingSavedProduct =
        await sequelize.models.SavedProduct.findOne();

      return request(app)
        .put(`/workspace/collections/1000/products/${existingSavedProduct.id}`)
        .expect(404);
    });

    it("should return 404 when saved product is not found", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const collectionModel = require("../../src/models/collection");
      collectionModel(sequelize);

      const existingCollection = await sequelize.models.Collection.findOne();

      return request(app)
        .put(`/workspace/collections/${existingCollection.id}/products/1000`)
        .expect(404);
    });

    it("should return 404 when collection and saved product is not found", async () => {
      return request(app)
        .put("/workspace/collections/1000/products/1000")
        .expect(404);
    });
  });

  describe("DELETE /workspace/collections/:collectionId/products/:savedProductId", () => {
    it("should remove a saved product from a collection", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const collectionModel = require("../../src/models/collection");
      collectionModel(sequelize);

      const existingCollection = await sequelize.models.Collection.findOne();

      const savedProductModel = require("../../src/models/saved_product");
      savedProductModel(sequelize);

      const savedProduct = await sequelize.models.SavedProduct.create({
        productId: "fooBar",
      });

      return request(app)
        .delete(
          `/workspace/collections/${existingCollection.id}/products/${savedProduct.id}`
        )
        .expect(201);
    });

    it("should return 404 when collection is not found", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const savedProductModel = require("../../src/models/saved_product");
      savedProductModel(sequelize);

      const existingSavedProduct =
        await sequelize.models.SavedProduct.findOne();

      return request(app)
        .delete(
          `/workspace/collections/1000/products/${existingSavedProduct.id}`
        )
        .expect(404);
    });

    it("should return 404 when saved product is not found", async () => {
      const sequelize = new Sequelize(postgresContainer.getConnectionUri());

      const collectionModel = require("../../src/models/collection");
      collectionModel(sequelize);

      const existingCollection = await sequelize.models.Collection.findOne();

      return request(app)
        .delete(`/workspace/collections/${existingCollection.id}/products/1000`)
        .expect(404);
    });

    it("should return 404 when collection and saved product is not found", async () => {
      return request(app)
        .delete("/workspace/collections/1000/products/1000")
        .expect(404);
    });
  });
});
