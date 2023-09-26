const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");

async function runAsUser(req, res, action) {
  const currentUser = req.user;

  if (currentUser) {
    return await action(currentUser, req, res);
  }

  KiwiStandardResponsesExpress.standardUnauthorizedResponse(
    "User is required",
    res,
  );
}

function pagingParams(req, defaultSortDir = "desc") {
  const perPage = parseInt(req.query.perPage || 10, 10);
  const page = parseInt(req.query.page || 1, 10);
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || defaultSortDir;

  return { perPage, page, skip, sortDir };
}

module.exports = {
  runAsUser,
  pagingParams,
};
