const express = require('express');
const router = express.Router();
const ScrapModel = require('../models/scraping');
// const Retrieve = require('../controllers/retrieve');

router.get('/',function(req,res){
    res.json({"msg":"Welcome to web scrapping.Go to /api/scrap for scrapping website.Go to /api/fetch for fetching data from database."});
});
router.get('/scrap',ScrapModel.mainFunction);
// router.get('/retrieveParsedUrls', Retrieve.getParsedUrls);

module.exports = router;