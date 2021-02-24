const express = require('express');
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({extended : true}))

app.get('/', function (req,res) {
  res.sendfile(__dirname + "/index.html");
})

app.get('/bmicalc', function (req,res) {
  res.sendfile(__dirname + "/bmicalc.html");


})

app.post('/bmicalc', function(req,res) {
  var weight = req.body.weight;
  var hight = req.body.hight;
  var bmi = weight/(hight*hight);

  res.send("Your BMI is : " + bmi );
})

app.post('/', function(req,res) {
  var num1 = req.body.num1;
  var num2 = req.body.num2;
  var result = num1 + num2;
  res.send(result);
})

app.listen(3000, function() {
  console.log("Server is started on 3000");
})
