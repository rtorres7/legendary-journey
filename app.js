var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var homeRouter = require("./routes/home");
var legacyRouter = require("./routes/legacy");
var articlesRouter = require("./routes/articles");
var usersRouter = require("./routes/users");

const constant = require("./util/constant");

var app = express();

// DB Setup
var mongoose = require("mongoose");

var DATABASE_URL = process.env.DATABASE_URL || "http://localhost";
mongoose.connect(`mongodb://${DATABASE_URL}/articles`, {
  useNewUrlParser: true,
});

var db = mongoose.connection;

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

db.once("open", function (callback) {
  console.log("Connection Succeeded");
});

var elasticsearch = require("@elastic/elasticsearch");
var esClient = new elasticsearch.Client({
  node: "http://elasticsearch:9200",
});

esClient.cluster.health({}, function (err, resp, status) {
  if (err) {
    console.log("-- ES Client Health ERROR --", err);
  } else {
    console.log("-- ES Health --", resp);
  }
});

(async () => {
  await constant.indices?.every((v) => {
    if (esClient.indices.exists({ index: v.index })) {
      return false;
    }
    return esClient.indices.create({
      index: v.index,
      mappings: v.mappings,
    });
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

module.exports = app;
