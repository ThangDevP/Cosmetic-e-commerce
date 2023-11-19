const currentURL = window.location.href;

const segments = currentURL.split("/");
const productId = segments[segments.length - 1];
userId = localStorage.getItem("userID");

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


  function updateProgressBar(totalSlides, currentSlide) {
    // Đoạn mã xử lý cập nhật thanh tiến trình
  }
  
  function onLoadSlickSlider() {
    $(".your-class").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: false,
      centerMode: true,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
      prevArrow:
        '<button type="button" class="slick-custom-arrow-prev"> < </button>',
      nextArrow:
        '<button type="button" class="slick-custom-arrow-next"> > </button>',
    });

    $(".your-class").on("init", function (event, slick, currentSlide) {
      updateProgressBar(slick.slideCount, currentSlide);
    });

    $(".your-class").on("afterChange", function (event, slick, currentSlide) {
      updateProgressBar(slick.slideCount, currentSlide);
    });

    $(".your-class").slick();

    updateProgressBar();
  }
  





  // Sử dụng hàm addToCart khi click vào nút thêm vào giỏ hàng
  const addToCartButton = document.querySelector(".add-to-cart-button");
  if (addToCartButton) {
    addToCartButton.addEventListener("click", () => {
      addToCart(productId);
    });
  }