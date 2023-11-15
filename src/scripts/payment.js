const userId = localStorage.getItem("userID");

async function fetchCartItems() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/carts?userId=${userId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Lỗi khi tải dữ liệu: ${response.status} ${response.statusText}`
      );
    }
    const cart = await response.json();

    if (cart && cart.length > 0) {
      const responseCartItems = await fetch(
        `http://localhost:3000/api/cartItems?cartId=${cart[0].id}&_expand=product`
      );
      if (!responseCartItems.ok) {
        throw new Error(
          `Lỗi khi tải dữ liệu: ${responseCartItems.status} ${responseCartItems.statusText}`
        );
      }
      const cartItems = await responseCartItems.json();

      return cartItems;
    }
  } catch (error) {
    console.error(error);
  }
}

async function showItems() {
  const products = await fetchCartItems();
  for (let i = 0; i < products.length; i++) {
    updatePaymentDetails(products[i].cartId);
  }
  document.querySelector(".products-payment").innerHTML = products
    .map((product) => {
      return `
        <div class="product-payment" data-id="${product.id}">
            <div class="item-img">
                <img
                src=${product.product.img}
                alt=""
                width="100%"
                height="100%"
                />
            </div>
            <div class="product-info">
                <span>${product.product.name}</span>
                <div class="quantity-price">
                <div class="quantity">
                <button class="btn-quantity decrease" onclick="updateQuantityProduct(&quot;decrease&quot;, ${
                  product.id
                }, ${product.product.price}, this)">-</button>
                    <div class="quantity-text" data-id="${product.id}">${
        product.quantity
      }</div>
                    <button class="btn-quantity increase"  onclick="updateQuantityProduct(&quot;increase&quot;, ${
                      product.id
                    }, ${product.product.price}, this)">+</button>
                </div>
                <div class="price" data-id="${product.id}">${
        product.product.price * product.quantity
      }đ</div>
                </div>
            </div>
            <div class="remove-product" onclick="removeProduct(${product.id}, ${
        product.cartId
      }, ${product.product.price}, ${product.quantity})">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
        `;
    })
    .join("");
}
showItems();

async function updateQuantityProduct(action, id, price) {
  const cartItem = await fetch(
    `http://localhost:3000/api/cartItems/${id}`
  ).then((response) => response.json());

  updatePaymentDetails(cartItem.cartId);

  let newQuantity = cartItem.quantity;

  if (action === "increase") {
    newQuantity++;
  } else if (action === "decrease" && newQuantity > 0) {
    newQuantity--;
  }

  const response = await fetch(`http://localhost:3000/api/cartItems/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: newQuantity }),
  });

  if (!response.ok) {
    throw new Error(
      `Lỗi khi cập nhật số lượng: ${response.status} ${response.statusText}`
    );
  }

  updateUI(id, newQuantity, price);
}

function updateUI(id, newQuantity, price) {
  const quantityElement = document.querySelector(
    `.quantity-text[data-id="${id}"]`
  );
  const priceElement = document.querySelector(`.price[data-id="${id}"]`);

  if (quantityElement && priceElement) {
    quantityElement.innerHTML = newQuantity;
    priceElement.innerHTML = newQuantity * price + "đ";
  }
}

async function updatePaymentDetails(cartId) {
  try {
    const res = fetch(
      `http://localhost:3000/api/cartItems?cartId=${cartId}&_expand=product`,
      {
        method: "GET",
        headers: {
          accept: "*",
        },
      }
    )
      .then((res) => res.json())
      .then((products) => {
        const provisionalAmount = products.reduce(
          (total, product) => total + product.product.price * product.quantity,
          0
        );

        document.querySelector(
          ".provisional-card .provisional:nth-child(1) p"
        ).textContent = `${provisionalAmount} đ`;

        const discountAmount = 0;
        const shippingFee = 0;

        const totalAmount = provisionalAmount - discountAmount + shippingFee;
        document.querySelector(
          ".order .total span"
        ).textContent = `${totalAmount} Đ`;
      });
  } catch (error) {
    console.log(error);
  }
}

async function removeProduct(cartItemId, cartId, productPrice, quantity) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/cartItems/${cartItemId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Lỗi khi xóa sản phẩm: ${response.status} ${response.statusText}`
      );
    }

    updatePaymentDetails(cartId);

    const productElement = document.querySelector(
      `.product-payment[data-id="${cartItemId}"]`
    );
    if (productElement) {
      productElement.style.display = "none";
    }
  } catch (error) {
    console.error(error);
  }
}
