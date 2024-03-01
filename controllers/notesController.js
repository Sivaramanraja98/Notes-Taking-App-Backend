const Note = require("../models/noteSchema");
const { validationResult } = require("express-validator");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};

const fetchNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json({ success: true, notes });
  } catch (error) {
    next(error);
  }
};

const fetchNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findOne({ _id: noteId, user: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, body } = req.body;
    const note = await Note.create({
      title,
      body,
      user: req.user._id,
    });
    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    next(error);
  }
};
const updateNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const { title, body } = req.body;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: req.user._id },
      { title, body },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ success: true, note: updatedNote });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      user: req.user._id,
    });
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
  errorHandler,
};
