function loadPage(slug) {
  const bodyElement = document.getElementById("body");
  const headerElement = document.getElementById("header");
  const footerElement = document.getElementById("footer");
  // Load header and footer (which remain the same)
  fetch("/header/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerElement.innerHTML = data;
    });
  fetch("/footer/footer.html")
    .then((response) => response.text())
    .then((data) => {
      footerElement.innerHTML = data;
    });

  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");

    if (n > slides.length) {
      slideIndex = 1;
    }

    if (n < 1) {
      slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
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


    
    $(".your-class-1").slick({
      slidesToShow: 2,
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

    $(".your-class-1").on("init", function (event, slick, currentSlide) {
      updateProgressBar(slick, currentSlide);
    });

    $(".your-class-1").on("afterChange", function (event, slick, currentSlide) {
      updateProgressBar(slick.slideCount, currentSlide);
    });

    $(".your-class-1").slick();

    updateProgressBar();
  }

  fetch(`/home.html`)
    .then((response) => response.text())
    .then((data) => {
      fetchProductSale().then(() => {
        onLoadSlickSlider();
      });

      bodyElement.innerHTML = data;

      let slideIndex = 1;

      showSlides(slideIndex);

      userName();
    })
    .catch(() => {
      bodyElement.innerHTML = "Page not found";
    });
}
// Function to handle routing based on the URL path
function handleRouting() {
  const path = window.location.pathname;
  const slug = path.replace("/", "");
  // Load the appropriate content based on the slug
  loadPage(slug || "home");
}
// Listen for changes in the URL (page navigation)
window.addEventListener("popstate", handleRouting);
// Initial page load
handleRouting();


var userId = localStorage.getItem("userID");

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
