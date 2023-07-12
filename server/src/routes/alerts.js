const express = require("express");
const router = express.Router();

router.get('/alerts/list', (req, res) => {
  /*
    #swagger.tags = ['Alerts']
    #swagger.summary = 'Returns list of current alerts. NOT YET IMPLEMENTED'
    #swagger.responses[200] = {
      schema: { $ref: '#/definitions/Alert' }
    }
   */

  // TODO: Need to implement alert models. This is here to stub out the call.
  res.json([]);
});

module.exports = router;
