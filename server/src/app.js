const { config } = require("./config/config");
const cors = require("cors");
const express = require("express");
const MongoStore = require("connect-mongo");
const auth = require("./services/auth");
const fs = require('fs');
const path = require("path");
const session = require("express-session");
const { successHandler, errorHandler } = require("./config/morgan");

const app = express();

/***********************************
 * Middleware setup
 **********************************/

/**
 * Container Redirector
 *
 * Adds a redirector if we are running inside of docker. This is done because the docker-compose setup for nginx prefixes
 * the calls with /api/ so that it knows how to route to the app. Whenever we respond with a redirect our server doesn't
 * know that we are behind that reverse proxy.
 */
app.use((req, res, next) => {
  if (config.mxs.env === "container") {
    const redirector = res.redirect;
    res.redirect = function (urlOrStatus, url) {
      if (isNaN(urlOrStatus)) {
        const redirectUrl =
          urlOrStatus === "/" ? urlOrStatus : "/api" + urlOrStatus;
        redirector.call(this, redirectUrl);
      } else {
        const redirectUrl = url === "/" ? url : "/api" + url;
        redirector.call(this, urlOrStatus, redirectUrl);
      }
    };
  }
  next();
});

/**
 * Session
 *
 * Manages HTTP session information
 */
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false, sameSite: true, maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DATABASE_URL,
    }), // Default TTL is 14 days
  }),
);

/**
 * Logging
 *
 * Sets up the HTTP request logging.
 */
if (process.env.NODE_ENV !== "test") {
  app.use(successHandler);
  app.use(errorHandler);
}

/**
 * JSON processing
 * Sets up JSON request body processing
 */
app.use(express.json());

/**
 * URL encoding support
 * Sets up support for URL encoding support and query param processing
 * TODO: Default max request body size is 100Kb, we may need to a larger limit to support attachments
 */
app.use(express.urlencoded());

/**
 * Static Asset support
 * Add support for static assets
 * TODO: I'm not sure we need this since we are basically building an API only mode app
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * CORS support
 * Add CORS support so that the UI is approved to talk to the server side.
 * TODO: If UI and server are going to be routed through a reverse proxy, then I don't think this is needed.
 */
app.use(cors());

/**
 * Passport OAuth support
 * Adds OAuth support using the passport library
 */
app.use(auth.passport.initialize());
app.use(auth.passport.session());

/**
 * Authentication
 * Adds a global check to make sure endpoint is authenticated
 */
app.use(auth.ensureAuthenticated);

/**
 * Documentation
 * Adds api documentation
 */
if (process.env.MXS_ENV === "container") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerFile = require("./swagger_output.json");

  const opts = {
    explorer: true,
    swaggerOptions: {
      oauth2RedirectUrl: "https://localhost:8443/api-docs/oauth2-redirect.html",
      oauth: {
        clientId: process.env.MXS_OAUTH_ID,
        clientSecret: process.env.MXS_OAUTH_SECRET,
      },
    },
  };

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, opts));
}

/***********************************
 * Data setup
 **********************************/

// Setup mongoose
const setupMongoose = require("./data/mongoose");
setupMongoose();

// Setup elastic search client
require("./data/elasticsearch");

// Load seed data
if (process.env.MXS_ENV === "container") {
  async function loadAllData(loadOrganizationData, loadUserData) {
    const organization = await loadOrganizationData();
    await loadUserData(organization);
  }

  async function loadObjectStore() {
    const { ObjectStoreService } = require("./services/object-store-service");
    const objectStoreService = new ObjectStoreService();
    try {
      await objectStoreService.makeBucket("attachments");
    } catch (error) {
      // bucket already exists
    }
    await objectStoreService.putObject("attachments", "WIReWIRe_sample_1/article.jpg-6c84eab870ad", fs.createReadStream(path.resolve("/tmp/mocks", "16x9_001_astronaut.jpg")), { "content-type": "image/jpeg"});
    await objectStoreService.putObject("attachments", "WIReWIRe_sample_2/article.jpg-99e9de7ed8b1", fs.createReadStream(path.resolve("/tmp/mocks", "16x9_002_mountains.jpg")), { "content-type": "image/jpeg"});
    await objectStoreService.putObject("attachments", "WIReWIRe_sample_3/article.jpg-63da601e3ec0", fs.createReadStream(path.resolve("/tmp/mocks", "16x9_003_soldier.jpg")),   { "content-type": "image/jpeg"});
    await objectStoreService.putObject("attachments", "WIReWIRe_sample_4/article.jpg-5ed69cb0cb22", fs.createReadStream(path.resolve("/tmp/mocks", "16x9_004_lima.jpg")),      { "content-type": "image/jpeg"});
  }

  // TODO: This will also take care of creating an eventlog index in ES,
  // given how initializeProductData() is implemented (looping through constant.indices).
  // Do we want to implement a similiar method in AggregatedMetricsService?
  // If so, we'll probably want to "split-up" the constant.indices array into separate files.
  const ProductService = require("./services/product-service");
  const productService = new ProductService();
  productService.initializeProductData();

  const { loadOrganizationData } = require("./postgres/seed");
  const { loadUserData } = require("./postgres/seed");

  loadAllData(loadOrganizationData, loadUserData).then(() => {
    console.log("All data loaded");
  });

  loadObjectStore().then(() => console.log("Loaded minio"));
}

/***********************************
 * Route setup
 **********************************/
const alertRouter = require("./routes/alerts");
const articlesRouter = require("./routes/articles");
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const indexRouter = require("./routes");
const legacyRouter = require("./routes/legacy");
const searchRouter = require("./routes/search");
const workspaceRouter = require("./routes/workspace");
const feedsRouter = require("./routes/feeds");
const metricsRouter = require("./routes/metrics");
const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");

app.use(indexRouter);
app.use(alertRouter);
app.use(articlesRouter);
app.use(authRouter);
app.use(homeRouter);
app.use(searchRouter);
app.use(workspaceRouter);
app.use(feedsRouter);
app.use(metricsRouter);

// Legacy routes
app.use(legacyRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  KiwiStandardResponsesExpress.standardNotFoundResponse("Page not found", res);
});

// error handler
// define as the last app.use callback
app.use((err, req, res) => {
  KiwiStandardResponsesExpress.standardErrorResponse(
    err.status || 500,
    err.message,
    res,
  );
});

module.exports = app;
