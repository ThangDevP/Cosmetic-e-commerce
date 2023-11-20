const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
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
app.use(express.static(path.join(__dirname, "/admin/users")));
app.use(express.static(path.join(__dirname, "/admin/categories")));
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
  const avatar = "https://res.cloudinary.com/darhyd9z6/image/upload/v1700494410/wzmvfm72trhfdsk990d8.png";
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
app.get("/products", function (req, res) {
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
  fetch(`https://exactly-i7jp.onrender.com/api/products?id=${productId}`)
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
  fetch(`https://exactly-i7jp.onrender.com/api/users?id=${userId}`)
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
app.get("/forgot-password", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/forgot-password.html"));
});
app.use(bodyParser.json());

app.post('/send-email-forgot-password', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'thang.nguyen-ojt07@devplus.edu.vn',
      pass: 'zugb emfd rpnp fxyn',
    },
  });

  async function main() {
    try {
      const info = await transporter.sendMail({
        from: '"Exactly Company" <thang.nguyen-ojt07@devplus.edu.vn>',
        to: email,
        subject: "Cocoon - Tìm lại mật khẩu",
        text: "Tìm lại mật khẩu thành công",
        html: `
        <p>Chào ${name},</p>
        <p>Mật khẩu của bạn là: <b>${password}</b></p>
        <i>Lưu ý: Bạn nên đổi lại mật khẩu mới để đảm bảo an toàn bảo mật!</i>
        `,
      });

      console.log("Message sent: %s", info.messageId);

      res.status(200).send({ message: 'Email đã được gửi đi!' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Có lỗi xảy ra khi gửi email.' });
    }
  }

  main().catch(console.error);
});

app.post('/send-email-order-success', (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const addr = req.body.addr;
  const city = req.body.city;
  const district = req.body.district;
  const total = req.body.total;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'thang.nguyen-ojt07@devplus.edu.vn',
      pass: 'zugb emfd rpnp fxyn',
    },
  });

  async function sendEmailOrder() {
    const info = await transporter.sendMail({
      from: '"Exactly Company" <thang.nguyen-ojt07@devplus.edu.vn>',
      to: email, 
      subject: "Cocoon - Đặt hàng thành công", 
      text: "Đặt hàng thành công", 
      html: `
      <p>Chào ${name},</p>
        <p>Cảm ơn bạn đã tin tưởng và đặt hàng tại Exactly.</p>
        <p>Dưới đây là thông tin đơn hàng của bạn:</p>
        <ul>
          <li><strong>Số điện thoại:</strong> ${phoneNumber}</li>
          <li><strong>Địa chỉ:</strong> ${addr}, ${district}, ${city}</li>
          <li><strong>Tổng cộng:</strong> ${total} VNĐ</li>
        </ul>
        <p>Xin vui lòng kiểm tra thông tin đơn hàng và thông tin vận chuyển.</p>
      `,
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  sendEmailOrder().catch(console.error);
});

app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/home.html"));
});
app.get("/blog", function (req, res) {
  res.sendFile(path.join(__dirname + "/pages/blog.html"));
});

server.post("/payments", (req, res) => {
  const { amount, data } = req.body;

  const urlParams = new URLSearchParams();
  urlParams.set("email", data.customerInfor.email);
  urlParams.set("username", data.customerInfor.username);
  urlParams.set("phoneNumber", data.customerInfor.phoneNumber);
  urlParams.set("addr", data.customerInfor.addr);
  urlParams.set("city", data.customerInfor.city);
  urlParams.set("district", data.customerInfor.district);
  urlParams.set("ward", data.customerInfor.ward);

  var partnerCode = "MOMO";
  var accessKey = "F8BBA842ECF85";
  var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  var requestId = partnerCode + new Date().getTime() + "id";
  var orderId = new Date().getTime();
  var orderInfo = "Thanh toán qua ví MoMo";
  var redirectUrl =
    "https://exactly-i7jp.onrender.com/checkout" + "?" + urlParams.toString();
  var ipnUrl = "https://exactly-i7jp.onrender.com/checkout" + "?" + urlParams.toString();
  var requestType = "captureWallet";
  var extraData = "";

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });

  const https = require("https");
  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
  };

  const reqq = https.request(options, (resMomo) => {
    resMomo.setEncoding("utf8");
    resMomo.on("data", (body) => {
      console.log(body);
      res.json({
        payUrl: JSON.parse(body).payUrl,
        statusCode: resMomo.statusCode,
      });
    });

    resMomo.on("end", () => {});
  });

  reqq.on("error", (e) => {});
  reqq.write(requestBody);
  reqq.end();
});

server.use(router);
// Local host --- Hosting
app.listen(port, () => {
  console.log(`Ecommerce website listening on http://localhost:${port}`);
});
