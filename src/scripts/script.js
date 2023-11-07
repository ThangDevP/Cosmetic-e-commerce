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

    const bodyElement = document.getElementById('body');
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    // Load header and footer (which remain the same)
    fetch('/header/header.html')
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        });
    fetch('/footer/footer.html')
        .then(response => response.text())
        .then(data => {
            footerElement.innerHTML = data;
        });
    // Load dynamic content based on the slug
        fetch('/api/history')
            .then(response => response.json())
            .then(data => {
                const historyElement = document.createElement('div');
                historyElement.classList.add('history-container');

                data.history.forEach(item => {
                    const historyItemElement = document.createElement('div');
                    historyItemElement.classList.add('history-item');
                    historyItemElement.innerHTML = `
                        <p>Purchase Date: ${item.purchaseDate}</p>
                        <p>Purchase Details: ${item.purchaseDetails}</p>
                        <p>Purchase Amount: ${item.purchaseAmount}</p>
                    `;
                    historyElement.appendChild(historyItemElement);
                });

                bodyElement.innerHTML = '';
                bodyElement.appendChild(historyElement);
            })
            .catch(() => {
                bodyElement.innerHTML = 'No purchase history found.';
            });


    fetch(`/home.html`)
        .then(response => response.text())
        .then(data => {
            bodyElement.innerHTML = data;
        })
        .catch(() => {
            bodyElement.innerHTML = 'Page not found';
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