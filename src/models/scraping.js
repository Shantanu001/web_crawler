var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var app = express();


  //scrap_function to crawl website url by passing url
  var scrap_function = (url) => {
    return new Promise((resolve, reject) => {
      request(url, function (err, res, body) {
        var url_list = [];
        if (err) resolve([]);
        if (body) {
          $ = cheerio.load(body);
          links = $("a");
          $(links).each(function (i, val) {
            url_list.push($(val).attr("href"));
          }, resolve(url_list));
        }
        resolve(url_list);
      });
    });
	};

	// inital list of urls 
	var url_array = ["https://medium.com/"];
	
	// recursive function for harvesting all possible links 
  recursive_function = () => {
    let url = url_array.shift();
    scrap_function(url)
      .then((url_list) => {
				url_array = [...url_array, ...url_list];
				console.log(url_array);
        recursive_function();
      })
      .catch((err) => {
        throw errr;
        console.log("scrapping done");
      });
  };


function mainFunction(req,res){
    recursive_function();
	res.json({"msg":"SCRAPPING PROCESS INITATED"});
}

module.exports = {mainFunction};