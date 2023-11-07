const currentURL = window.location.href;

const segments = currentURL.split("/");
const productId = segments[segments.length - 1];

fetch(`/api/products/${productId}`)
  .then((response) => response.json())
  .then((product) => {
    // Update the HTML elements with the product details
    document.querySelector(".product-title").textContent = product.name;
    document.querySelector(".product-price").textContent = product.price + " đ";
    // document.querySelector(".product-price-discount").textContent =
    //   (product.price * (100 - product.discount)) / 100;
    document.querySelector(".product-description").textContent = product.description;
    // Assuming you have an element with class "product-category"
    // document.querySelector(".product-category").textContent = product.category;
    // Assuming you have an element with class "product-image"
    document.querySelector(".img").src = "/" + product.img;
  })
  .catch((error) => console.error("Error fetching product data: ", error));
