//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-nikhil:admin-nikhil@cluster0.om0g890.mongodb.net/todolistDB", {useNewUrlParser: true});
const itemsSchema = new mongoose.Schema({
  name : String
});
const Item = mongoose.model("Item",itemsSchema);
const item1 = new Item({
  name:"Buy Food"
});
const item2 = new Item({
  name:"Buyy milk"
});
const item3 = new Item({
  name:"feed doggo"
});
const defaultItems = [item1,item2,item3];
// Item.insertMany([defaultItems4]);
const customschema = new mongoose.Schema({
  name : String,
  items: [itemsSchema]
});
const List = new mongoose.model("List",customschema);

app.get("/", function(req, res) {
  Item.find({}).then(function(Founditems){
    if(Founditems.length===0){
      Item.insertMany(defaultItems);
      res.redirect("/")
    }else{
      res.render("list", {listTitle: "Today", newListItems: Founditems});
    }
      
  });
});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const itemInsert = new Item({
    name : item
  })
  itemInsert.save();
  res.redirect("/");
  
});
app.post("/delete",function(req,res){
  console.log(req.body.checkbox);
  const checkedID = (req.body.checkbox);
  Item.findByIdAndRemove(checkedID).then(function(err){
    if(!err){
      console.log("removed");
    }
  })
  res.redirect("/");
});

app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;
  async function custom(){
    const finder = List.findOne({name:customListName});
    return finder;
  }

  custom().then( function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list

        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });



});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
