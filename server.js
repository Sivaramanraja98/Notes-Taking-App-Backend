require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/ConnectDB");
const notesController = require("./controllers/notesController");
const usersController = require("./controllers/usersController");
const Auth = require("./middleware/Auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

connectToDb();

app.post("/signup", usersController.signup);
app.post("/login", usersController.login);
app.get("/logout", usersController.logout);
app.get("/check-auth", Auth, usersController.checkAuth);

app.get("/notes",Auth, notesController.fetchNotes);
app.get("/notes/:id",Auth,  notesController.fetchNote);
app.post("/notes",Auth,  notesController.createNote);
app.put("/notes/:id",Auth,  notesController.updateNote);
app.delete("/notes/:id", Auth, notesController.deleteNote);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
