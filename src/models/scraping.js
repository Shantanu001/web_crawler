var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var dbUpdate = require("./updateDB");
var app = express();

// inital list of urls
var task_url_array = ["https://medium.com/"];
var scraped_url_completed = [];
var completed_url_list = [];
var running_url_list = [];
var concurrent = 5;

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

//check if the url is valid and belong to medium

function isValidURL(url) {
  let pattern1 = "medium";
  let pattern2 = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  pattern1 = new RegExp(pattern1);
  pattern2 = new RegExp(pattern2);
  return pattern1.test(url) && pattern2.test(url);
}

function checkConcurrency() {
  return (running_url_list.length < concurrent && task_url_array.length);
}
function removeDuplicate(taskUrls) {
  return new Promise((resolve, reject) => {
    let updated_list = taskUrls.filter((url) => {
      if (!scraped_url_completed[url] && isValidURL(url)) return true;
      else return false;
    });
    resolve(updated_list);
  });
}
// recursive function for harvesting all possible links
recursive_function = () => {
  while (checkConcurrency()) {
    //console.log(task_url_array);
    let url = task_url_array.shift();
    //console.log(url);
    if (!scraped_url_completed[url] && isValidURL(url)) {
      console.log("inside1");
      scraped_url_completed[url] = true;

      scrap_function(url)
        .then((url_list) => {
          if (url_list.length > 0) {
            removeDuplicate(url_list).then((filteredUrls) => {
              task_url_array = [...task_url_array, ...filteredUrls];
              completed_url_list.push(running_url_list.shift());

              if (
                task_url_array.length == 0 ||
                completed_url_list.length == 50
              ) {
                console.log("scrapping done");
                onComplete_scrapping(completed_url_list);
                completed_url_list.length = 0;
              }
              completed_url_list.push(running_url_list.shift());
              recursive_function();
            });
            //console.log(task_url_array);
          } else {
            task_url_array = [...task_url_array, ...url_list];
            completed_url_list.push(running_url_list.shift());
            if (task_url_array.length == 0 || completed_url_list.length == 50) {
              console.log("scrapping done");
              onComplete_scrapping(completed_url_list);
              completed_url_list.length = 0;
            }
            recursive_function();
          }
        })
        .catch((err) => {
          recursive_function();
          console.log("scrapping done");
          onComplete_scrapping(completed_url_list);
        });
      running_url_list.push(url);
    }
  }
};

function mainFunction(req, res) {
  recursive_function();
  res.json({ msg: "SCRAPPING PROCESS INITATED" });
}

function onComplete_scrapping(list) {
  dbUpdate.update_data_to_db(list);
}

module.exports = { mainFunction };
