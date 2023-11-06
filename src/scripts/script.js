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
  // Load dynamic content based on the slug
  fetch(`/${slug}.html`)
    .then((response) => response.text())
    .then((data) => {
      bodyElement.innerHTML = data;
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