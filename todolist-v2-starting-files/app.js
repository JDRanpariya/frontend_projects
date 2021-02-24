//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true ,  useNewUrlParser: true });


var Schema = mongoose.Schema;
const itemSchema = new Schema({
  item:String,

});

const Item = mongoose.model('item', itemSchema);
const workItem = mongoose.model('workitem', itemSchema);

const item1 = new Item ({
  item:"wake up"
});

const item2 = new Item ({
  item:"work"
});

const item3 = new Item ({
  item:"sleep"
});

const defaultItems =[item1, item2, item3];



app.get("/", function(req, res) {

// const day = date.getDate();

  Item.find({}, function(err, foundItems) {

    if (foundItems.length===0){
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        }else {
          console.log("defaultItems added");
        }
      });
      res.redirect("/");
    }
    else {
        res.render("list", {listTitle: "today", newListItems: foundItems});
    }

  });



});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    item: itemName
  });

  item.save();

  res.redirect("/");

});

app.post("/delete", function (req,res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (err) {
      console.log(err);
    }else {
      console.log("success");
    }

    res.redirect("/");
  });
});

app.get("/:customName", function (req, res) {
  const page = req.params.customName;
  workItem.find({}, function(err, foundItems) {

    if (foundItems.length===0){
      workItem.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        }else {
          console.log("defaultItems added");
        }
      });
      res.redirect("/:param");
    }
    else {
        res.render("list",{listTitle: page, newListItems: foundItems})
    }
    });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
