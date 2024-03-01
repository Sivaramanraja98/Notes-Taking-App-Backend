const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const Auth = require("../middleware/Auth");

router.get("/notes", Auth, notesController.fetchNotes);
router.get("/notes/:id", Auth, notesController.fetchNote);
router.post("/notes", Auth, notesController.createNote);
router.put("/notes/:id", Auth, notesController.updateNote);
router.delete("/notes/:id", Auth, notesController.deleteNote);

module.exports = router;
