const { KiwiPage } = require("@kiwiproject/kiwi-js");

const request = require("supertest");
const { setupAppWithUser } = require("../__utils__/expressUtils");

jest.mock("../../src/services/product-service.js", () => {
  return jest.fn().mockImplementation(() => {
    const { articles } = require("../__utils__/dataLoader");
    return {
      findPageOfDraftProductsForUser: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return {
          content: articles.filter((article) => article.state === "draft"),
        };
      }),
      findPageOfDraftProductsForProducingOrg: jest
        .fn()
        .mockImplementation((producingOrgName) => {
          if (process.env.THROW_TEST_ERROR) {
            throw new Error("whoops");
          }
          return {
            content: articles.filter(
              (article) =>
                article.state === "posted" &&
                article.producingOffices.findIndex(
                  (i) => i.name === producingOrgName,
                ) >= 0,
            ),
          };
        }),
      findPageOfRecentProductsForUser: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return {
          content: articles.filter((article) => article.state === "posted"),
        };
      }),
      findPageOfRecentProductsForProducingOffice: jest
        .fn()
        .mockImplementation((producingOfficeName) => {
          if (process.env.THROW_TEST_ERROR) {
            throw new Error("whoops");
          }

          return {
            content: articles.filter(
              (article) =>
                article.state === "posted" &&
                article.producingOffices.findIndex(
                  (i) => i.name === producingOfficeName,
                ) >= 0,
            ),
          };
        }),
      findPageOfProductsForUser: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return {
          content: articles,
        };
      }),
      countAllByOrganization: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }

        return Promise.resolve({ totalCreated: articles.length });
      }),
      findRecentViewedProductsForUser: jest.fn().mockImplementation(() => {
        if (process.env.THROW_TEST_ERROR) {
          throw new Error("whoops");
        }
        return Promise.resolve(KiwiPage.of(1, 4, 20, articles.slice(0, 4)));
      }),
    };
  });
});

jest.mock("../../src/services/workspace.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      findPageOfSavedProductsForUser: jest.fn().mockImplementation(() => {
        return {
          content: [{ productId: "WIReWIRe_sample_1" }],
        };
      }),
      createSavedProduct: jest.fn().mockImplementation((productId) => {
        return { id: 1, productId: productId };
      }),
      deleteSavedProduct: jest.fn(),
      findPageOfCollectionsForUser: jest.fn().mockImplementation(() => {
        return {
          content: [{ name: "Sample Collection" }],
        };
      }),
      createCollection: jest.fn().mockImplementation((data) => {
        return {
          id: 1,
          name: data.name,
          description: data.description,
          image: data.image,
          createdBy: data.createdBy,
        };
      }),
      updateCollection: jest.fn().mockImplementation((id, data) => {
        return {
          id: id,
          name: data.name,
          description: data.description,
          image: data.image,
          createdBy: data.createdBy,
        };
      }),
      deleteCollection: jest.fn(),
      deleteCollectionImage: jest.fn(),
      findSavedProductsInCollection: jest
        .fn()
        .mockImplementation((collectionId) => {
          if (collectionId === "1") {
            return {
              content: [{ productId: "WIReWIRe_sample_1" }],
            };
          }

          return [];
        }),
      addSavedProductToCollection: jest
        .fn()
        .mockImplementation((collectionId, productId) => {
          if (collectionId === "1" && productId === "1") {
            return {};
          }

          return null;
        }),
      removeSavedProductFromCollection: jest
        .fn()
        .mockImplementation((collectionId, productId) => {
          if (collectionId === "1" && productId === "1") {
            return {};
          }

          return null;
        }),
      isProductSaved: jest.fn().mockImplementation(() => {
        return true;
      }),
    };
  });
});

jest.mock("../../src/services/aggregated-metrics-service.js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTotalViewsForProductsPublishedByOrganization: jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve({ totalViews: { totalViews: 500 } });
        }),
      getProductViewsCountForMultipleProducts: jest
        .fn()
        .mockResolvedValue({ "really-cool-product": 1 }),
    };
  });
});

describe("Workspace Routes", () => {
  const CURRENT_USER = { id: 1, dataValues: { organization: "AGRICULTURE" } };

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.THROW_TEST_ERROR;
  });

  describe("GET /workspace/drafts", () => {
    it("should return draft products", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .get("/workspace/drafts")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(1);

          expect(res.body.content[0].productNumber).toBe("WIReWIRe_sample_4");
        });
    });

    it("should return standard error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app).get("/workspace/drafts").expect(500, {
        message: "Unable to find draft products: whoops",
        error: "Unable to find draft products: whoops",
        code: 500,
        fieldName: "",
        itemId: "",
      });
    });
  });

  describe("GET /workspace/recent", () => {
    it("should return recent posted products for user's organization", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, {
        id: 1,
        dataValues: { organization: "ANCESTRY" },
      });

      return request(app)
        .get("/workspace/recent")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(2);

          const ids = res.body.content.map((product) => product.productNumber);
          // expect(ids).toStrictEqual(["WIReWIRe_sample_1", "WIReWIRe_sample_2", "WIReWIRe_sample_3", "WIReWIRe_sample_4"]);
          expect(ids).toStrictEqual(["WIReWIRe_sample_2", "WIReWIRe_sample_3"]);
        });
    });

    it("should return recent posted products from organization only", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, {
        id: 100,
        dataValues: { organization: "AGRICULTURE" },
      }); // user 100 does not exist

      return request(app)
        .get("/workspace/recent")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(1);

          const ids = res.body.content.map((product) => product.productNumber);
          expect(ids).toStrictEqual(["WIReWIRe_sample_4"]);
        });
    });

    it("should return standard error response when lookup fails", () => {
      process.env.THROW_TEST_ERROR = true;

      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app).get("/workspace/recent").expect(500, {
        message: "Unable to find posted products: whoops",
        error: "Unable to find posted products: whoops",
        code: 500,
        fieldName: "",
        itemId: "",
      });
    });
  });

  describe("GET /workspace/stats", () => {
    it("should return stats", () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, {
        id: 1,
        Organization: { name: "AGRICULTURE" },
      });

      return request(app)
        .get("/workspace/stats")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body).toHaveProperty("totalViews");
          expect(res.body).toHaveProperty("totalCreated");
        });
    });
  });

  describe("GET /workspace/saved", () => {
    it("should return all saved products", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return await request(app)
        .get("/workspace/saved")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(1);

          const ids = res.body.content.map(
            (savedProduct) => savedProduct.productId,
          );
          expect(ids).toStrictEqual(["WIReWIRe_sample_1"]);
        });
    });
  });

  describe("PUT /workspace/saved/:productId", () => {
    it("should mark a product saved", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

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
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app).delete(`/workspace/saved/to-be-deleted`).expect(204);
    });
  });

  describe("GET /workspace/collections", () => {
    it("should return all collections", () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .get("/workspace/collections")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(1);

          const ids = res.body.content.map((collection) => collection.name);
          expect(ids).toStrictEqual(["Sample Collection"]);
        });
    });
  });

  describe("POST /workspace/collections", () => {
    it("should create a collection", () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .post("/workspace/collections")
        .field("name", "Should save")
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
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .put(`/workspace/collections/1`)
        .field("name", "Updated name")
        .field("description", "Updated description")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.name).toBe("Updated name");
          expect(res.body.description).toBe("Updated description");
        });
    });
  });

  describe("DELETE /workspace/collections/:collectionId", () => {
    it("should delete a collection", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app).delete(`/workspace/collections/1`).expect(204);
    });
  });

  describe("GET /workspace/collections/:collectionId/products", () => {
    it("should return all products for a collection", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .get(`/workspace/collections/1/products`)
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.content.length).toBe(1);

          const ids = res.body.content.map(
            (savedProduct) => savedProduct.productId,
          );
          expect(ids).toStrictEqual(["WIReWIRe_sample_1"]);
        });
    });
  });

  describe("PUT /workspace/collections/:collectionId/products/:savedProductId", () => {
    it("should add a saved product to a collection", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .put(`/workspace/collections/1/products/1`)
        .expect(200);
    });

    it("should return 404 when collection is not found", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .put(`/workspace/collections/1000/products/1`)
        .expect(404);
    });

    it("should return 404 when saved product is not found", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .put(`/workspace/collections/1/products/1000`)
        .expect(404);
    });

    it("should return 404 when collection and saved product is not found", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .put("/workspace/collections/1000/products/1000")
        .expect(404);
    });
  });

  describe("DELETE /workspace/collections/:collectionId/products/:savedProductId", () => {
    it("should remove a saved product from a collection", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .delete(`/workspace/collections/1/products/1`)
        .expect(204);
    });

    it("should return 404 when collection is not found", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .delete(`/workspace/collections/1000/products/1`)
        .expect(404);
    });

    it("should return 404 when saved product is not found", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .delete(`/workspace/collections/1/products/1000`)
        .expect(404);
    });

    it("should return 404 when collection and saved product is not found", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .delete("/workspace/collections/1000/products/1000")
        .expect(404);
    });
  });

  describe("GET /workspace/viewed", () => {
    it("should return recently viewed products", async () => {
      const router = require("../../src/routes/workspace");
      const app = setupAppWithUser(router, CURRENT_USER);

      return request(app)
        .get(`/workspace/viewed`)
        .expect(200)
        .expect("Content-Type", /json/)
        .then((res) => {
          expect(res.body.number).toEqual(1); // page num
          expect(res.body.totalElements).toEqual(20); // total
          expect(res.body.content.length).toEqual(4);
        });
    });
  });
});
