const currentURL = window.location.href;

const segments = currentURL.split("/");
const productId = segments[segments.length - 1];

fetch(`/api/products/${productId}?_expand=brand&_expand=category`)
  .then((response) => response.json())
  .then((product) => {
    // Update the HTML elements with the product details
    document.querySelector(".product-title").textContent = product.name;
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
        "http://localhost:3000/api/products?sale=true"
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
    const categoryElement = document.querySelector(".product-category"); // Lấy phần tử có class .product-category
  
    if (categoryElement) {
      const category = categoryElement.textContent.trim(); // Lấy giá trị của .product-category và loại bỏ khoảng trắng thừa
  
      document.querySelector("#your-class-first").innerHTML = products
        .filter((product) => product.category === category) // Lọc sản phẩm dựa trên giá trị của .product-category
        .map((product) => {
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
  

  