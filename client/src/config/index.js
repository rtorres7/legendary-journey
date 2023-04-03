let file;
if (process.env.NODE_ENV === "development") {
  file = require("../../../development.metadata.json");
} else {
  file = require(`./${process.env.NODE_ENV}.metadata.json`);
}
export const metadata = file;
