const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type:String
  },
  body: {
    type:String
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref :"User",
  }
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
