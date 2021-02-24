const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express()

app.use(bodyParser.urlencoded({extend:true}))

app.get('/',function (req,res) {

  res.sendFile(__dirname + "/index.html")
})

app.post('/', function(req,res) {


var n1 = req.body.crypto;
var n2 = req.body.Fiat;
var symbol = n1 + n1;
request("https://apiv2.bitcoinaverage.com/indices/global/ticker/" + symbol, function(error,response , body) {

        var data = JSON.parse(body);
        var price = data.last;
        res.send("<h1> The weekly avg of bitcoin is : </h1>" + price);

})

})

app.listen(3000, function () {
  console.log("Server started on port 3000");
})
