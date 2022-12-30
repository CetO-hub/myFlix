const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

let topTen = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
  },
  {
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
  },
  {
    title: "Avatar",
    author: "James Cameron",
  },
  {
    title: "Matrix",
    author: "Wachowskis",
  },
  {
    title: "Titanic",
    author: "James Cameron",
  },
  {
    title: "Forrest Gump",
    author: "Robert Zemeckis",
  },
  {
    title: "Catch me if you can",
    author: "Steven Spielberg",
  },
  {
    title: "Hachiko",
    author: "Lasse Hallström",
  },
  {
    title: "Inception",
    author: "Christopher Nolan",
  },
  {
    title: "Batman",
    author: "Tim Burton",
  },
];

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello to the myFlix app");
});

app.get("/movies", (req, res) => {
  res.json(topTen);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something broke");
});

app.listen("8080", () => {
  console.log("Server is running at port 8080");
});
