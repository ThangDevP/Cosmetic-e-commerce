const currentURL = window.location.href;
const segments = currentURL.split('/');
const productId = segments[segments.length - 1];

document.getElementById("addToCart").addEventListener("click", () => {
  const productId = segments[segments.length - 1];
  const productName = document.getElementById("product-name").textContent;
  const productPrice = parseFloat(document.getElementById("product-price").textContent);
  const productQuantity = parseInt(document.getElementById("quantity").textContent, 10);

  // Tạo dữ liệu sản phẩm để thêm vào giỏ hàng
  const productData = {
    id: productId,
    name: productName,
    price: productPrice,
    quantity: productQuantity,
  };

  fetch("/api/cart")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Lỗi API");
    }
    return response.json();
  })
  .then((cartItems) => {
    // Check if the product already exists in the cart
    const existingProductIndex = cartItems.findIndex((item) => item.id === productData.id);

    if (existingProductIndex !== -1) {
      // If the product already exists, update its quantity
      cartItems[existingProductIndex].quantity += productData.quantity;
    } else {
      // If the product is not in the cart, add it
      cartItems.push(productData);
    }

    // Perform a POST request to update the cart on the server
    return fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItems), // Send the entire cartItems array
    });
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error adding product to cart");
    }
    // Xử lý khi sản phẩm đã được thêm vào giỏ hàng
    alert("Sản phẩm đã được thêm vào giỏ hàng");
    window.location.href = "/cart";
  })
  .catch((error) => console.error("Error adding product to cart: ", error));
});


fetch(`/api/products/${productId}`) // Fetch the product data by its ID
  .then((response) => response.json())
  .then((product) => {
    // Update the HTML elements with the product details
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = product.price;
    const finalPrice = (document.getElementById(
      "product-price-discount"
    ).textContent = (product.price * (100 - product.discount)) / 100);
    document.getElementById("product-description").textContent =
      product.description;
    document.getElementById("product-category").textContent = product.category;
    document.getElementById("product-image").src = "/" + product.img;

    // Calculate the total price based on the quantity and update it
    const decrementButton = document.querySelector(".decrement");
    const incrementButton = document.querySelector(".increment");
    const quantityLabel = document.getElementById("quantity");
    const totalPriceLabel = document.getElementById("total-price");

    function updateTotalPrice() {
      const quantity = parseInt(quantityLabel.textContent, 10);
      const total = finalPrice * quantity;
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
