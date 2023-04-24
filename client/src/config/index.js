let file;
if (process.env.NODE_ENV === "production") {
  file = require("../../../production.metadata.json");
} else {
  file = require(`./${process.env.NODE_ENV}.metadata.json`);
}
export const metadata = file;
