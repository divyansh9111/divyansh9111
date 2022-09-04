require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const _ = require("lodash");
const mongoString = process.env.DATABASE_URL;
//mongoose
const mongoose = require("mongoose");
mongoose.connect(mongoString, { useNewUrlParser: true });




// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://divyansh9111:<password>@cluster0.9aj2eel.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
// perform actions on the collection object
//   client.close();
// });







// const date=require(__dirname+"/date");
// const items = ["Buy food", "Cook food", "Eat food"]; //For storing new list items
// const workItems = [];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// schema for list items
const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const listSchema = mongoose.Schema({
  name: String,
  items: [itemSchema],
});

//model for list items
const Item = mongoose.model("Item", itemSchema);

//model for lists
const List = mongoose.model("List", listSchema);

// creating default items
const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "Hit this to delete an item. -->",
});

// default items to be inserted into the db every time
const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  // let today=date.getDate();
  //finding items in this method  every time when we go to home route
  Item.find({}, (err, foundItems) => {
    //
    if (foundItems.length === 0) {
      // inserting items into the db in the case when the db is empty
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        }
        console.log("Successfully inserted the default items to db! ");
        //   mongoose.disconnect();
      });

      //the function stops here if this condition is true and its not going to render the "index" page so we'll have to redirect to the / (home) route and this time it will render the "index" page
      res.redirect("/");
    }
    if (err) {
      console.log(err);
    }
    res.render("list", { listTitle: "Today", newItems: foundItems });
  });
});
// dynamic route
// responding to routes according to different toDo lists category

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  // using found one bcs we have to show only one list
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      }else if(foundList.items.length===0){
        for (let i = 0; i < defaultItems.length; i++) {
          foundList.items.push(defaultItems[i]);
        }
        foundList.save();         
        console.log("added default items to  custom list");
        res.redirect("/" + customListName);
      }
       else {
        res.render("list", {
          listTitle: foundList.name,
          newItems: foundList.items,
        });
      }
    }
  });
});

// Deleting an item
app.post("/delete", (req, res) => {
  let itemId = req.body.submit;
  let listName =req.body.listName;
  console.log(listName);
  console.log(itemId);
  if (listName === "Today") {
    // Item.deleteOne({ _id: checkedItemId }, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log("Deleted one item!");
    //   res.redirect("/"); //IMP
    // });
     Item.findByIdAndRemove(itemId,(err)=>{
     if (err) {
      console.log(err);
     }
    console.log("Deleted one item!");
    res.redirect("/");//IMP
  });
  } else {
    List.findOneAndUpdate({name:listName},{$pull: {items: {_id: itemId }}},(err) => {
        if (!err) {
          console.log("Deleted one item from a list document!");
          res.redirect("/" + listName);
        } 
      }
    );
  }

  //does not execute if callback not provided!

  // Item.findByIdAndRemove(checkedItemId,(err)=>{
  //    if (err) {
  //     console.log(err);
  //   }
  //   console.log("Deleted one item!");
  //   res.redirect("/");//IMP
  // });
});

app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  const listName = req.body.list;

  const addedItem = new Item({
    name: itemName,
  });

  // Item to bna li dekhna ye h ki use save kis list m krna hai?
  if (listName === "Today") {
    addedItem.save(); //shortcut
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      if (err) {
        console.log(err);
      }
      foundList.items.push(addedItem);
      foundList.save(); //important to save an item after making any changes to it
      console.log("Added an item inside a list document");
      res.redirect("/" + listName);
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
