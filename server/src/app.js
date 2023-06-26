const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const MongoStore = require('connect-mongo');
const auth = require('./services/auth');
const path = require("path");
const session = require("express-session");

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
  if (process.env.MXS_ENV === 'container' ) {
    const redirector = res.redirect;
    res.redirect = function(url) {
      url = url === '/' ? url : '/api' + url;
      redirector.call(this, url);
    }
  }
  next();
});

/**
 * Session
 *
 * Manages HTTP session information
 */
app.set('trust proxy', 1);
app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false, sameSite: true, maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({ mongoUrl: `mongodb://${process.env.MONGO_DATABASE_URL}/articles` }) // Default TTL is 14 days
  })
);

/**
 * Logging
 *
 * Sets up the HTTP request logging.
 */
if (process.env.MXS_ENV === 'container') {
  app.use(logger("dev"));
} else {
  app.use(logger('combined'));
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
app.use(auth.ensureAuthenticated)

/***********************************
 * Middleware setup
 **********************************/

// Setup mongoose
const setupMongoose = require('./data/mongoose');
setupMongoose();

// Setup elastic search client
require('./data/elasticsearch');

// Load seed data
if (process.env.MXS_ENV === 'container') {
  const ProductService = require('./services/product-service');
  const productService = new ProductService();
  productService.initializeProductData();
}

/***********************************
 * Route setup
 **********************************/
const alertRouter = require("./routes/alerts");
const articlesRouter = require("./routes/articles");
const authRouter = require('./routes/auth');
const homeRouter = require("./routes/home");
const indexRouter = require("./routes");
const legacyRouter = require("./routes/legacy");
const searchRouter = require("./routes/search");
const usersRouter = require("./routes/users");
const workspaceRouter = require("./routes/workspace");
const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");

app.use("/", indexRouter);
app.use("/alerts", alertRouter);
app.use("/articles", articlesRouter);
app.use("/auth", authRouter);
app.use("/home", homeRouter);
app.use("/search", searchRouter);
app.use("/users", usersRouter);
app.use("/workspace", workspaceRouter);

// Legacy routes
app.use("/documents", legacyRouter);
app.use("/my_wire", legacyRouter);
app.use("/preload", legacyRouter);
app.use("/special_editions", legacyRouter);
app.use("/wires", legacyRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  KiwiStandardResponsesExpress.standardNotFoundResponse('Page not found', res);
});

// error handler
// define as the last app.use callback
app.use((err, req, res) => {
  KiwiStandardResponsesExpress.standardErrorResponse(err.status || 500, err.message, res);
});

module.exports = app;
