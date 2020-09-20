var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.get('/crawler',function(req,res){
  url = "https://google.com/";

let final_url_list = ["https://medium.com/"];
let data =  new Promise((resolve,reject)=>{
  request(url,function(err,res,body){
    var url_list = [];
    if(err) resolve([]);
    if(body){
      $ = cheerio.load(body);
      links = $('a');
      $(links).each(function(i,val){
          url_list.push($(val).attr('href'));
      }, resolve(url_list));
    }
    resolve(url_list);
  })
});

data.then(function(result){
  console.log(result);
  res.json(result);
})

console.log('here');

});

app.listen(8080,()=>{
  console.log("app running on port 8080");
});


