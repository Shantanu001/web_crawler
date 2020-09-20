var express = require("express");
var app = express();
const routes = require("./src/routes/apiRoutes");


app.get('/crawler',function(req,res){
	recursive_function();
	res.json({"msg":"SCRAPPING PROCESS INITATED"});
})

app.use('/api',routes);

app.listen(8080, () => {
  console.log("app running on port 8080");
});
