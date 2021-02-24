const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
var newitems = ['Eat food', 'Read Book'];

app.get("/", function(req, res) {


  var options = {
    weekday:"long",
    day:"numeric",
    month:"long",
  }

  var today = new Date();
  var day = today.toLocaleDateString("en-US", options);


  res.render("list", {day: day, added_items: newitems});
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/", function (req, res) {

   newitem = req.body.newItem;
   newitems.push(newitem);
  res.redirect("/");

});





app.listen(3000, function () {

  console.log("Server is started on port 3000");
});
