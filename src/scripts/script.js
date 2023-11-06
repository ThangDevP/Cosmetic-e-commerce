// Example code to listen to button clicks for updating and removing items
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cart-items").addEventListener("click", (e) => {
      if (e.target.classList.contains("update-quantity")) {
          const productId = e.target.dataset.productId;
          const newQuantity = parseInt(prompt("Enter new quantity:"));
          if (!isNaN(newQuantity)) {
              updateCartItemQuantity(productId, newQuantity);
          }
      } else if (e.target.classList.contains("remove-item")) {
          const productId = e.target.dataset.productId;
          removeFromCart(productId);
      }
  });
});

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
      updateProgressBar(slick, currentSlide);
    });

    $(".your-class").on("afterChange", function (event, slick, currentSlide) {
      updateProgressBar(slick.slideCount, currentSlide);
    });

    $(".your-class").slick();

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
