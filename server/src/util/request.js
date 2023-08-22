const { KiwiStandardResponsesExpress } = require("@kiwiproject/kiwi-js");

async function runAsUser(req, res, action) {
  const currentUser = req.user;

  if (currentUser) {
    return await action(currentUser, req, res);
  }

  KiwiStandardResponsesExpress.standardUnauthorizedResponse('User is required', res);
}

function pagingParams(req) {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * perPage;
  const sortDir = req.query.sortDir || 'desc';

  return { perPage, page, skip, sortDir };
}

module.exports = {
  runAsUser,
  pagingParams
};
