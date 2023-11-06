const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const jsonServer = require("json-server");
const { error } = require("console");
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const app = express();
const port = 3000;
// Set up CORS for your Express app
app.use(cors());
// Show request, HTTP logger
app.use(morgan("combined"));
// Use static file
app.use(express.static(path.join(__dirname, "styles")));
app.use(express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "components")));
app.use(express.static(path.join(__dirname, "pages")));
app.use(express.static(path.join(__dirname, "assets/img")));

// JSON Server setup
const server = jsonServer.create();
// const adapter = new FileSync('db.json');
// const db = low(adapter);
server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === "PATCH" || req.method === "PUT") {
    req.body.updatedAt = Date.now();
  }
  next();
});

server.post("/register", (req, res) => {
  const { username, password } = req.body;
  // Check if the user already exists
  const existingUser = router.db.get("users").find({ username }).value();
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists." });
  }
  // If the user doesn't exist, add them to the database
  const id = Date.now();
  const newUser = { id, username, password };
  router.db.get("users").push(newUser).write();
  return res.status(200).json({ message: "Registration successful." });
});

// Mount the JSON Server on the '/api' path
app.use("/api", server);

// Serve your routes
app.get("/about-us", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/about-us.html"));
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/main.html"));
});
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/login.html"));
});
app.get("/user/:id", function (req, res) {
  const userId = Number(req.params.id);
  fetch(`http://localhost:3000/api/users?id=${userId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 1) {
        res.sendFile(path.join(__dirname + "/pages/user.html"));
      }
    })
    .catch((error) => {
      console.error("Error fetching product data: ", error);
      // You may want to send an error response here
    });
});
server.use(router);
// Local host --- Hosting
app.listen(port, () => {
  console.log(`Ecommerce website listening on http://localhost:${port}`);
});
