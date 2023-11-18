const currentURL = window.location.href;

const segments = currentURL.split("/");
const productId = segments[segments.length - 1];

fetch(`/api/products/${productId}?_expand=brand&_expand=category`)
  .then((response) => response.json())
  .then((product) => {
    // Update the HTML elements with the product details
    document.querySelector(".product-title").textContent = product.productName;
    document.querySelector(".product-price-basic").textContent = product.price
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace(/,/g, ".")
      .replace(/₫/, "VNĐ");
    if (product.discount !== 0) {
      document.querySelector(".product-price-discount").textContent = (
        (product.price * (100 - product.discount)) /
        100
      )
        .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        .replace(/,/g, ".")
        .replace(/₫/, "VNĐ");
    } else {
      document.querySelector(".product-price-discount").textContent = "";
      document.querySelector(".product-price-basic").style.textDecoration =
        "none";
    }

    document.querySelector(".product-description").textContent =
      product.description;
    document.querySelector(".product-category").textContent = product.category.cateName;
    document.querySelector(".product-brand").textContent = "Thương hiệu: " + product.brand.name;
    document.querySelector(".img").src = product.img;
  })
  .catch((error) => console.error("Error fetching product data: ", error));

  //slide sản phẩm đề suất
  async function fetchProductSale() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/products?_expand=brand&_expand=category"
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu");
      }
      const products = await response.json();
      await displaySlide(products);
    } catch (error) {
      console.error(error);
    }
  }

  async function displaySlide(products) {
    const categoryElement = document.querySelector(".product-category"); 
    if (categoryElement) {
      const category = categoryElement.textContent.trim(); // Lấy giá trị của .product-category và loại bỏ khoảng trắng thừa
      document.querySelector("#your-class-first").innerHTML = products
        .filter((product) => product.category.cateName === category) // Lọc sản phẩm dựa trên giá trị của .product-category
        .map((product) => {
          console.log(product)
          return `
          <div id="slider" class="slider-content">
            <a href="/product/${product.id}">
              <img src=${product.img} alt=""/>
            </a>
            <div class="slide-info">
              <div class="infor-text">
                <a href="/product/${product.id}">
                  <h6>${product.name}</h6>
                </a>
                <p>
                  ${product.category}
                </p>
                <p class="text-amount">${product.price}.000đ</p>
              </div>
              <div class="infor-btn">
                <button class="btn-add-card" onclick="haha(${product.id})" ><i class="fa-solid fa-cart-plus"></i></button>
              </div>
            </div>
          </div>
          `;
        })
        .join("");
    }
  }
  

  userId = localStorage.getItem("userID");

  async function addToCart(productId) {
    try {
      // Bước 1: Kiểm tra xem người dùng đã đăng nhập chưa

      // Bước 2: Tìm giỏ hàng của người dùng
      const response = await fetch(`http://localhost:3000/api/carts?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Lỗi khi tìm giỏ hàng: ${response.status} ${response.statusText}`);
      }
      const carts = await response.json();

      if (carts.length === 0) {
        // Nếu chưa có giỏ hàng, tạo giỏ hàng mới
        const newCartResponse = await fetch(`http://localhost:3000/api/carts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!newCartResponse.ok) {
          throw new Error(`Lỗi khi tạo giỏ hàng mới: ${newCartResponse.status} ${newCartResponse.statusText}`);
        }
      }

      // Bước 3: Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const cartIdResponse = await fetch(`http://localhost:3000/api/carts?userId=${userId}`);
      const cartData = await cartIdResponse.json();

      const cartId = cartData[0].id;

      const cartItemsResponse = await fetch(`http://localhost:3000/api/cartItems?cartId=${cartId}&productId=${productId}`);
      const cartItems = await cartItemsResponse.json();

      if (cartItems.length > 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        const cartItemId = cartItems[0].id;
        const updatedQuantity = cartItems[0].quantity + 1;

        const updateCartItemResponse = await fetch(`http://localhost:3000/api/cartItems/${cartItemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: updatedQuantity }),
        });

        if (!updateCartItemResponse.ok) {
          throw new Error(`Lỗi khi cập nhật số lượng: ${updateCartItemResponse.status} ${updateCartItemResponse.statusText}`);
        }
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        const addCartItemResponse = await fetch(`http://localhost:3000/api/cartItems`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            cartId,
            quantity: 1,
          }),
        });

        if (!addCartItemResponse.ok) {
          throw new Error(`Lỗi khi thêm sản phẩm vào giỏ hàng: ${addCartItemResponse.status} ${addCartItemResponse.statusText}`);
        }
      }

      // Bước 4: Cập nhật giỏ hàng
      // Cập nhật UI hoặc thực hiện các bước khác cần thiết
      alert("Đã thêm sản phẩm vào giỏ hàng!");

    } catch (error) {
      console.error(error);
      // Xử lý lỗi nếu có
    }
  }

  // Sử dụng hàm addToCart khi click vào nút thêm vào giỏ hàng
  const addToCartButton = document.querySelector(".add-to-cart-button");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      addToCart(productId);
    });
  }