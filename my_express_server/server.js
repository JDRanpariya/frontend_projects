const express = require('express');

const app = express()

app.get('/', function (req,res) {
    res.send("Who n the hell are you?");
  console.log(request);
});

app.get('/admin', function (req,res) {
  res.send("Why n the hell you want to visit admin page?");
});

app.listen(1030,function () {
  console.log("Server is started on 1030");

});
