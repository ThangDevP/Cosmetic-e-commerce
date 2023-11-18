const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const app = express();
const port = 3000;

app.use(cors());
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "styles")));
app.use(express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "components")));
app.use(express.static(path.join(__dirname, "pages")));
app.use(express.static(path.join(__dirname, "assets/img")));
app.use(express.static(path.join(__dirname, "admin")));
app.use(express.static(path.join(__dirname, "/admin/dashboard")));
app.use(express.static(path.join(__dirname, "/admin/dashboard")));
app.use(express.static(path.join(__dirname, "/admin/users")));
app.use(express.static(path.join(__dirname, "/admin/categories")));
app.use(express.static(path.join(__dirname, "/admin/products")));
app.use(express.static(path.join(__dirname, "/admin/products")));
// JSON Server setup
const server = jsonServer.create();

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
  const { username, email, password } = req.body;
  const phoneNumber = "";
  const address = "";
  const city = "";
  const district = "";
  const ward = "";
  const avatar = "https://res-console.cloudinary.com/darhyd9z6/media_explorer_thumbnails/f07a78203e70fa0d5822a1c1f08172e4/detailed";
  const role = "user";
  const dob = "2001-12-21";
  const gender = "male";
  // Check if the user already exists
  const existingUser = router.db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ message: "Tài khoản này đã được sử dụng." });
  }
  // If the user doesn't exist, add them to the database
  const id = Date.now();
  const newUser = {
    id,
    username,
    password,
    email,
    phoneNumber,
    address,
    city,
    district,
    ward,
    avatar,
    role,
    dob,
    gender,
  };
  router.db.get("users").push(newUser).write();
  return res.status(200).json({ message: "Đăng kí thành công." });
});

app.use("/api", server);

// Serve your routes
app.get("/product", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/all-product.html"));
});
app.get("/about-us", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/about-us.html"));
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/main.html"));
});
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/login.html"));
});
app.get("/dashboard", function (req, res) {
  res.sendFile(path.join(__dirname + "/admin/dashboard/dashboard.html"));
});
app.get("/manageUser", function (req, res) {
  res.sendFile(path.join(__dirname + "/admin/users/manageuser.html"));
});
app.get("/manageCategory", function (req, res) {
  res.sendFile(path.join(__dirname + "/admin/categories/categories.html"));
});
app.get("/manageProduct", function (req, res) {
  res.sendFile(path.join(__dirname + "/admin/products/products.html"));
});
app.get("/products/:id", function (req, res) {
  const productId = Number(req.params.id); // Use req.params.id to access the route parameter
  console.log(productId);
  fetch(`http://localhost:3000/api/products?id=${productId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 1) {
        res.sendFile(path.join(__dirname + "/pages/product-detail.html"));
      }
    })
    .catch((error) => {
      console.error("Error fetching product data: ", error);
      // You may want to send an error response here
    });
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
      res.status(404).send("User not found");
    });
});

app.get("/checkout", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/checkout.html"));
});

app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/home.html"));
});
app.get("/blog", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/blog.html"));
});

server.use(router);
// Local host --- Hosting
app.listen(port, () => {
  console.log(`Ecommerce website listening on http://localhost:${port}`);
});
