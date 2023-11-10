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
const cart = [];

app.use(cors());
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "styles")));
app.use(express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "components")));
app.use(express.static(path.join(__dirname, "pages")));
app.use(express.static(path.join(__dirname, "dashboard")));
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

// router.post("/api/cart", (req, res) => {
//   try {
//     const productData = req.body;
//     /// Kiểm tra xem sản phẩm có tồn tại trong giỏ hàng chưa
//   const existingProductIndex = cart.findIndex((item) => item.id === productData.id);

//   if (existingProductIndex !== -1) {
//     // Nếu sản phẩm đã tồn tại, cập nhật số lượng
//     cart[existingProductIndex].quantity += productData.quantity;
//   } else {
//     // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
//     cart.push(productData);
//   }
//     res.status(200).json({ message: "Product added to cart successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.post("/api/cart", (req, res) => {
  try {
    const productData = req.body;
    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex((item) => item.id === productData.id);

    if (existingProductIndex !== -1) {
      // If the product already exists, update the quantity
      cart[existingProductIndex].quantity += productData.quantity;
      res.status(200).json({ message: "Product quantity updated in the cart successfully." });
    } else {
      // If the product doesn't exist, add it to the cart
      cart.push(productData);
      res.status(200).json({ message: "Product added to the cart successfully." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const fs = require('fs');

const cartDataFile = 'db.json'; 

// API thêm sản phẩm vào giỏ hàng
router.post('/cart', (req, res) => {

  // Đọc dữ liệu giỏ hàng hiện tại
  fs.readFile(cartDataFile, (err, data) => {
    if (err) throw err;
    
    let cart = JSON.parse(data);

    const newProduct = req.body; // sản phẩm cần thêm mới
    
    // Kiểm tra sản phẩm đã tồn tại chưa
    const existingProduct = cart.find(p => p.id == newProduct.id);

    if (existingProduct) {
      // Nếu sp đã có, cộng dồn số lượng
      existingProduct.quantity += newProduct.quantity;
    } else {
      // Nếu sp chưa có, thêm mới vào mảng
      cart.push(newProduct); 
    }

    // Ghi đè giỏ hàng vào file
    fs.writeFile(cartDataFile, JSON.stringify(cart), err => {
      if (err) throw err;
      res.json({message: 'Thêm sản phẩm thành công!'});
    });

  });

});


// API cập nhật số lượng sản phẩm trong giỏ
router.patch('/cart/:productId', (req, res) => {
  
  const productId = req.params.productId;
  const newQuantity = req.body.quantity;

  fs.readFile(cartDataFile, (err, data) => {
    if (err) throw err;

    let cart = JSON.parse(data);

    // Tìm sản phẩm cần update
    const product = cart.find(p => p.id == productId);

    if (product) {
      product.quantity = newQuantity; // Cập nhật số lượng
      
      fs.writeFile(cartDataFile, JSON.stringify(cart), err => {
        if (err) throw err;
        res.json({message: 'Cập nhật số lượng thành công!'})  
      });

    } else {
      res.status(404).json({message: 'Không tìm thấy sản phẩm!'});
    }

  });

});


// API xóa sản phẩm khỏi giỏ hàng
router.delete('/cart/:productId', (req, res) => {

  const productId = req.params.productId;

  fs.readFile(cartDataFile, (err, data) => {
    if (err) throw err;

    let cart = JSON.parse(data);

    // Tìm và xóa sản phẩm khỏi mảng
    const productIndex = cart.findIndex(p => p.id == productId);
    if (productIndex >= 0) {
      cart.splice(productIndex, 1); 
    }

    fs.writeFile(cartDataFile, JSON.stringify(cart), err => {
      if (err) throw err;  
      res.json({message: 'Đã xóa sản phẩm khỏi giỏ hàng!'}) ;
    });

  });


});


app.get("/cart/:id", (req, res) => {
  const productId = req.params.id;

  // Tìm sản phẩm trong giỏ hàng dựa trên productId (hoặc product-id, tùy vào cấu trúc của dữ liệu cart)
  // Ví dụ: sử dụng productId để tìm sản phẩm trong dữ liệu cart
  const productInCart = cart.find((item) => item["product-id"] === productId);

  if (productInCart) {
    // Nếu tìm thấy sản phẩm trong giỏ hàng, bạn có thể hiển thị thông tin sản phẩm
    res.send(`Product Name: ${productInCart.name}, Quantity: ${productInCart.quantity}`);
  } else {
    // Nếu không tìm thấy sản phẩm, bạn có thể trả về một trang hoặc thông báo lỗi
    res.send("Product not found in the cart.");
  }
});


server.post("/register", (req, res) => {
  const { username, email, password } = req.body;
    const phoneNumber = "";
    const address = "";
    const avatar = "";
    const role = "user";
  // Check if the user already exists
  const existingUser = router.db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists." });
  }
  // If the user doesn't exist, add them to the database
  const id = Date.now();
  const newUser = { id, username, password, email, phoneNumber, address, avatar, role };
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
app.get("/manageUser", function (req, res) {
  res.sendFile(path.join(__dirname + "/dashboard/manageuser.html"));
});
app.get("/product/:id", function (req, res) {
  const productId = Number(req.params.id); // Use req.params.id to access the route parameter
  console.log(productId);
  fetch(`http://localhost:3000/api/products?id=${productId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 1) {
        res.sendFile(path.join(__dirname + "/pages/product.html"));
      }
    });
  });
app.get("/history", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/history.html"));
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
app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname + '/pages/home.html'));
});
server.use(router);
// Local host --- Hosting
app.listen(port, () => {
  console.log(`Ecommerce website listening on http://localhost:${port}`);
});