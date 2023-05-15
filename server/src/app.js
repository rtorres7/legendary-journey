const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("morgan");

const indexRouter = require("./routes");
const homeRouter = require("./routes/home");
const legacyRouter = require("./routes/legacy");
const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");
const searchRouter = require("./routes/search");

const constant = require("./util/constant");

const app = express();

// DB Setup
const mongoose = require("mongoose");

const DATABASE_URL = process.env.DATABASE_URL || "http://localhost";
mongoose.connect(`mongodb://${DATABASE_URL}/articles`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.on("error", function (error) {
  // If first connect fails because server-database isn't up yet, try again.
  // This is only needed for first connect, not for runtime reconnects.
  // See: https://github.com/Automattic/mongoose/issues/5169
  if (
    error.message &&
    error.message.match(/failed to connect to server .* on first connect/)
  ) {
    setTimeout(function () {
      mongoose
        .connect(`mongodb://${DATABASE_URL}/articles`, {
          useNewUrlParser: true,
        })
        .catch(() => {
          // empty catch avoids unhandled rejections
        });
    }, 20 * 1000);
  } else {
    // Some other error occurred.  Log it.
    console.error(new Date(), String(error));
  }
});

db.once("open", function () {
  console.log("Connection Succeeded");
});

const elasticsearch = require("@elastic/elasticsearch");
const esClient = new elasticsearch.Client({
  node: "http://elasticsearch:9200",
});

esClient.cluster.health({}, function (err, resp) {
  if (err) {
    console.log("-- ES Client Health ERROR --", err);
  } else {
    console.log("-- ES Health --", resp);
  }
});

(async () => {
  await constant.indices?.every(async (v) => {
    if (await esClient.indices.exists({ index: v.index })) {
      return false;
    }

    const index = esClient.indices.create({
      index: v.index,
      mappings: v.mappings,
    });

    const Article = require("./models/articles");
    const IndexService = require("./services/index");
    const indexService = new IndexService();

    Article.find(
      {},
      function (error, articles) {
        if (error) {
          console.error(error);
        }

        articles.forEach(article => {
          indexService.create(article.indexable);
        });
      }
    );

    return index;
  });
})();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", indexRouter);
app.use("/articles", articlesRouter);
app.use("/home", homeRouter);
app.use("/preload", legacyRouter);
app.use("/wires", legacyRouter);
app.use("/my_wire", legacyRouter);
app.use("/documents", legacyRouter);
app.use("/users", usersRouter);
app.use("/special_editions", legacyRouter);
app.use("/search", searchRouter);

module.exports = app;
