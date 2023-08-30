const _ = require("lodash");
const dayjs = require("dayjs");

function findArticleImage(attachments) {
  const latest = _.reduce(
    attachments,
    function (result, value) {
      if (value.usage === "article") {
        if (result == null) {
          return value;
        }

        if (dayjs(result.updated_at).isBefore(dayjs(value.updated_at))) {
          return value;
        }
      }
      return result;
    },
    null,
  );
  return latest != null ? [latest] : [];
}

export { findArticleImage };
