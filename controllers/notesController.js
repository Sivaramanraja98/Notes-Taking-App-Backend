const Note = require("../models/noteSchema");

const fetchNotes = async (req, res) => {
  try {
    // Find the notes
    const notes = await Note.find({user: req.user._id});

    // Respond with them
    res.json({ notes });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const fetchNote = async (req, res) => {
  try {
    // Get id off the url
    const noteId = req.params.id;

    // Find the note using that id
    const note = await Note.findById({_id:noteId,user:req.user._id});

    // Respond with the note
    res.json({ note });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    // Get the sent in data off request body
    const { title, body } = req.body;

    // Create a note with it
    const note = await Note.create({
      title,
      body,
      user : req.user._id,
    });

    // respond with the new note
    res.json({ note });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    // Get the id off the url
    const noteId = req.params.id;

    // Get the data off the req body
    const { title, body } = req.body;

    // Find and update the record
    await Note.findOneAndUpdate({_id:noteId, user: req.user._id}, {
      title,
      body,
    });

    // Find updated note
    const note = await Note.findById({_id:noteId, user: req.user._id});

    // Respond with it
    res.json({ note });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    // Get id off the URL
    const noteId = req.params.id;

    // Delete the record
    const result = await Note.findByIdAndDelete(noteId);

    if (result) {
      res.json({ success: "Record deleted" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
};
