document.getElementById("cart-items").addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-item")) {
    // Handle Remove button click
    const productId = event.target.getAttribute("data-product-id");
    removeFromCart(productId);
  } else if (event.target.classList.contains("update-quantity")) {
    // Handle Update button click
    const productId = event.target.getAttribute("data-product-id");
    const newQuantity = parseInt(
      document.getElementById(`quantity-${productId}`).value
    );
    updateCartItemQuantity(productId, newQuantity);
  }
});

function handleRouting() {
    const path = window.location.pathname;
    const slug = path.replace("/", "");
    if (slug === "cart") {
      loadCartPage();
    } else {
      loadPage(slug || "home");
    }
  }
  
  // Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {

  fetch(`/api/cart/${productId}`, {
    method: 'DELETE' 
  })
  .then(res => res.json())
  .then(data => {
    console.log(data.message); // Thông báo xóa thành công

    // Load lại danh sách giỏ hàng
    loadCartItems(); 
  })
  .catch(err => {
    console.error('Error deleting product', err);
  });

}

// Cập nhật số lượng sản phẩm
function updateCartItemQuantity(productId, newQuantity) {

  fetch(`/api/cart/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({quantity: newQuantity})
  })
  .then(res => res.json())
  .then(data => {
    console.log(data.message);

    // Load lại danh sách giỏ hàng
    loadCartItems();
  })
  .catch(err => {
    console.error('Error updating quantity', err);
  })

}
  function loadCartPage() {
    fetch("/cart.html")
      .then((response) => response.text())
      .then((data) => {
        const bodyElement = document.querySelector("body");
        bodyElement.innerHTML = data;
        loadCartItems();
      });
  }

  function loadCartItems() {
    fetch(`/api/cart`)
      .then((response) => response.json())
      .then((cartItems) => {
        const cartItemsElement = document.getElementById("cart-items");
        let totalQuantity = 0;
        let totalPrice = 0;
  
        if (!cartItemsElement) {
          console.error("Element with id 'cart-items' not found.");
          return;
        }
  
        if (cartItems.length === 0) {
          cartItemsElement.innerHTML = "Không có sản phẩm trong giỏ hàng.";
        } else {
          cartItemsElement.innerHTML = ""; // Clear existing content
  
          cartItems.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${item.name}</td>
              <td>$${item.price}</td>
              <td>
                <input type="number" value="${item.quantity}" id="quantity-${item.id}">
                <button class="update-quantity" data-product-id="${item.id}">Update</button>
              </td>
              <td>$${item.price * item.quantity}</td>
              <td>
                <button class="remove-item" data-product-id="${item.id}">Remove</button>
              </td>
            `;
            cartItemsElement.appendChild(row);
  
            totalQuantity += item.quantity;
            totalPrice += item.price * item.quantity;
          });
  
          // Add event listeners for update and remove buttons here
          const updateButtons = cartItemsElement.querySelectorAll(".update-quantity");
          const removeButtons = cartItemsElement.querySelectorAll(".remove-item");
  
          updateButtons.forEach((button) => {
            button.addEventListener("click", handleUpdateButtonClick);
          });
  
          removeButtons.forEach((button) => {
            button.addEventListener("click", handleRemoveButtonClick);
          });
        }
  
        document.getElementById("total-quantity").textContent = totalQuantity;
        document.getElementById("total-price").textContent = totalPrice;
      })
      .catch(() => {
        const cartItemsElement = document.getElementById("cart-items");
        if (cartItemsElement) {
          cartItemsElement.innerHTML = "Không có sản phẩm trong giỏ hàng.";
        }
      });
  }
  
  // Function to handle the update button click
  function handleUpdateButtonClick(event) {
    const productId = event.target.getAttribute("data-product-id");
    const newQuantity = parseInt(
      document.getElementById(`quantity-${productId}`).value
    );
    updateCartItemQuantity(productId, newQuantity);
  }
  
  // Function to handle the remove button click
  function handleRemoveButtonClick(event) {
    const productId = event.target.getAttribute("data-product-id");
    removeFromCart(productId);
  }
  
  
  
  handleRouting();
  
