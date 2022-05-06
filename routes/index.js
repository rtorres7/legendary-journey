var express = require('express');
var router = express.Router();

const arxiv = require('arxiv-api');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/articles', (req, res) => {

  const papers = arxiv
    .search({
        searchQueryParams: [
            {
                include: [{name: 'cs.*'}],
            },
            {
                include: [{name: 'econ.*'}],
            },
        ],
        start: 0,
        maxResults: 10,
    })
    .then((papers) => res.send(papers))
    .catch((error) => console.log(error));

});

router.get('/article/:id', (req, res) => {
  const id = Number(req.params.id);
  const article = null  //TODO
  res.send(article);
});

module.exports = router;
