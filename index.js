const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  Models = require("./models.js"),
  bodyParser = require("body-parser");

const { default: mongoose } = require("mongoose");

let Movies = Models.Movie;
let Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.get("/movies/:title/genre", (req, res) => {
  Movies.find({ Title: req.params.title }, "Genre")
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.get("/directors/:name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name }, "Director")
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .send(`The user ${req.body.Username} already exists`);
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
          });
      }
    })
    .catch((error) => {
      res.status(500).send(`Error: ${error}`);
    });
});

app.put("/users/:id/:username", (req, res) => {
  Users.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { Username: req.params.username } },
    { new: true }
  )
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(201).send(`Error: ${err}`);
    });
});

app.post("/users/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.body.Username },
    { $addToSet: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.delete("/users/:MovieID/:username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.delete("/users/:username", (req, res) => {
  Users.findOneAndDelete({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .send(`User with the username: ${req.params.username} not found`);
      } else {
        res
          .status(201)
          .send(
            `User with the username: ${req.params.username} has been deleted.`
          );
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something broke");
});

app.listen("8080", () => {
  console.log("Server is running at port 8080");
});
