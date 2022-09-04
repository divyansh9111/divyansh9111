const express = require("express");

const router = express.Router();

module.exports = router;
const Model = require("../models/model");
//Post Method
router.post("/post", (req, res) => {
  const data = new Model({
    name: req.body.name,
    age: req.body.age,
  });
  data.save((err) => {
    if (!err) {
      res.send("Successfully added a new data");
    } else {
      res.send(err);
    }
  });
});

//Get all Method
router.get("/getAll", (req, res) => {
  // res.send('Get All API');
  Model.find({}, (err, founddatas) => {
    if (!err) {
      // console.log(foundArticles);
      res.send(founddatas);
    } else {
      console.log(err);
    }
  });
});

//Get by ID Method
router.get("/getOne/:id", (req, res) => {
  // res.send(req.params.id);
  Model.findById(req.params.id, (err, foundData) => {
    if (foundData) {
      res.send(foundData);
    } else {
      res.send("No data found with that name!");
    }
  });
});

//Update by ID Method
router.patch("/update/:id", (req, res) => {
  // res.send('Update by ID API');
  const id = req.params.id;
  const updatedData = req.body;
  const options = { new: true };
  Model.findByIdAndUpdate(id, updatedData, options, (err) => {
    if (!err) {
      res.send("Successfully updated the  data");
    } else {
      res.send(err);
    }
  });
});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  // res.send('Delete by ID API');
  const id = req.params.id;
  Model.findByIdAndDelete(id, (err) => {
    if (!err) {
      res.send("Successfully deleted the  data");
    } else {
      res.send(err);
    }
  });
});
