const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

const app = express();

let topFive = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    director: "J.K. Rowling",
  },
  {
    title: "Lord of the Rings",
    director: "J.R.R. Tolkien",
  },
  {
    title: "Avatar",
    director: "James Cameron",
  },
  {
    title: "Matrix",
    director: "Wachowskis",
  },
  {
    title: "Titanic",
    director: "James Cameron",
  },
];

let movies = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    director: "J.K. Rowling",
    description:
      "An orphaned boy enrolls in a school of wizardry, where he learns the truth about himself, his family and the terrible evil that haunts the magical world.",
    genre: ["Adventure", "Family", "Fantasy"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BY2I4NWE2OTAtMzZhNC00MjgzLTg2ZDEtMTllYWI5MDdiMWE0XkEyXkFqcGdeQXVyMTYzMDM0NTU@._V1_FMjpg_UX611_.jpg",
  },
  {
    title: "Lord of the Rings",
    director: "J.R.R. Tolkien",
    description:
      "The Fellowship of the Ring embark on a journey to destroy the One Ring and end Sauron's reign over Middle-earth.",
    genre: ["Adventure", "Fantsay"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BOGMyNWJhZmYtNGQxYi00Y2ZjLWJmNjktNTgzZWJjOTg4YjM3L2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_FMjpg_UX979_.jpg",
  },
  {
    title: "Avatar",
    director: "James Cameron",
    description:
      "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    genre: ["Action", "Adventure", "Fantasy"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UY720_.jpg",
  },
  {
    title: "Matrix",
    director: "Wachowskis",
    description:
      "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    genre: ["Action", "Sci-Fi"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UY721_.jpg",
  },
  {
    title: "Titanic",
    director: "James Cameron",
    description:
      "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    genre: ["Drama", "Romance"],
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UY720_.jpg",
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

app.get("/movies/:title", (req, res) => {
  res.json(
    movies.find((movie) => {
      {
        return movie.title === req.params.title;
      }
    })
  );
});

app.get("/movies/:title/genre", (req, res) => {
  res.json(
    movies.find((movie) => {
      if (movie.title === req.params.title) {
        return [movie.genre];
      }
    })
  );
});

app.get("/movies/directors/:name", (req, res) => {
  res.send(
    `Successful GET request returning data on the director "${req.params.name}"`
  );
});

app.post("/users", (req, res) => {
  res.send(`The user has been created`);
});

app.put("/users/:id/:username", (req, res) => {
  res.send(
    `The user with the id "${req.params.id}" has changed username to "${req.params.username}"`
  );
});

app.post("/users/:title", (req, res) => {
  res.send(`The film "${req.params.title}" has been added`);
});

app.delete("/users/:title", (req, res) => {
  res.send(`The film "${req.params.title}" has been deleted`);
});

app.delete("/users/:id", (req, res) => {
  res.send(`The user "${req.params.id}" has been deleted`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something broke");
});

app.listen("8080", () => {
  console.log("Server is running at port 8080");
});
