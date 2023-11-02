// Assuming you have a product ID (e.g., 1) you want to display
const productId = 1; // Update this with the desired product ID

fetch(`/api/products/${productId}`) // Fetch the product data by its ID
  .then((response) => response.json())
  .then((product) => {
    // Update the HTML elements with the product details
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = product.price;
    document.getElementById("product-price-discount").textContent =
      (product.price * (100 - product.discount)) / 100;
    document.getElementById("product-description").textContent =
      product.description;
    document.getElementById("product-category").textContent = product.category;
    document.getElementById("product-image").src = product.img;

    // Calculate the total price based on the quantity and update it
    const decrementButton = document.querySelector(".decrement");
    const incrementButton = document.querySelector(".increment");
    const quantityLabel = document.getElementById("quantity");
    const totalPriceLabel = document.getElementById("total-price");

    function updateTotalPrice() {
      const quantity = parseInt(quantityLabel.textContent, 10);
      const total = product.price * quantity;
      totalPriceLabel.textContent = total;
    }

    decrementButton.addEventListener("click", () => {
      let quantity = parseInt(quantityLabel.textContent, 10);
      if (quantity > 1) {
        quantity--;
        quantityLabel.textContent = quantity;
        updateTotalPrice();
      }
    });

    incrementButton.addEventListener("click", () => {
      let quantity = parseInt(quantityLabel.textContent, 10);
      quantity++;
      quantityLabel.textContent = quantity;
      updateTotalPrice();
    });

    // Initial total price
    updateTotalPrice();
  })
  .catch((error) => console.error("Error fetching product data: ", error));
