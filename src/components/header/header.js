function dropdownFunc() {
  var x = document.getElementById("dropdown_menu");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
var userId = localStorage.getItem("userID");
function userName() {
  var name = localStorage.getItem("username");

  var userChange = document.getElementById("user-change");

  // Nếu userId không tồn tại trong localStorage, hiển thị nút Đăng nhập
  if (!userId) {
    userChange.innerHTML = '<a class="active" href="/login">Đăng nhập</a>';
    return;
  }

  fetch(`http://localhost:3000/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(userData => {
      // Lấy thông tin người dùng từ API
      var name = userData.username;
      var role = userData.role;

      // Cập nhật UI với tên người dùng
      if (name) {
        // Tạo một phần tử <a> mới với nội dung đã cập nhật
        if (role === "admin") {
          var newA = document.createElement("a");
          newA.classList.add("active");
          newA.href = `/dashboard`;
          newA.textContent = "Dashboard";
        } else {
        var newA = document.createElement("a");
        newA.classList.add("active");
        newA.href = `user/${userId}`;
        newA.textContent = name;
      }
        // Tạo và điền nội dung của sub-menu
        var subMenu = document.createElement("ul");
        subMenu.classList.add("sub-menu");
        subMenu.style.display = "none"; // Ẩn submenu ban đầu
        subMenu.innerHTML = `
          <li><a href="" id="user">Hồ sơ người dùng</a></li>
          <li><a href="" id="logout">Đăng xuất</a></li>
        `;

        // Xóa nội dung hiện tại của userChange
        userChange.innerHTML = "";

        // Thêm phần tử <a> mới và sub-menu vào <li> hiện tại
        userChange.appendChild(newA);
        userChange.appendChild(subMenu);

        // Thêm bộ lắng nghe sự kiện để ẩn sub-menu khi con trỏ rời khỏi "user-change"
        userChange.addEventListener("mouseleave", function () {
          subMenu.style.display = "none";
        });

        // Thêm bộ lắng nghe sự kiện để hiển thị sub-menu khi di chuột qua "user-change"
        userChange.addEventListener("mouseenter", function () {
          subMenu.style.display = "block";
        });

        // Thêm bộ lắng nghe sự kiện để chuyển hướng khi người dùng nhấp vào "Hồ sơ người dùng"
        var userButton = document.getElementById("user");
        userButton.addEventListener("click", function (e) {
          e.preventDefault();
          window.location.href = `/user/${userId}`;
        });

        // Thêm bộ lắng nghe sự kiện để đăng xuất
        var logoutButton = document.getElementById("logout");
        logoutButton.addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.clear();
          window.location.href = "/";
        });
      }
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
}

// Gọi hàm userName khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded event fired');
  userName();
});



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
    console.log("Cart data:", cart);

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
      console.log("CartItems data:", cartItems);
      return cartItems;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

async function showItems() {
  try {
    const products = await fetchCartItems();

    console.log("Products:", products);

    const productsContainer = document.querySelector(".products-payment");

    if (productsContainer) {
      if (products && products.length > 0) {
        productsContainer.innerHTML = products
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
                            <span>${product.product.productName}</span>
                            <div class="quantity-price">
                                <div class="quantity">
                                    <button class="btn-quantity decrease" onclick="updateQuantityProduct(&quot;decrease&quot;, ${product.id
              }, ${product.product.price}, this)">-</button>
                                    <div class="quantity-text" data-id="${product.id}">${product.quantity
              }</div>
                                    <button class="btn-quantity increase" onclick="updateQuantityProduct(&quot;increase&quot;, ${product.id
              }, ${product.product.price}, this)">+</button>
                                </div>
                                <div class="price" data-id="${product.id}">
                                ${(product.product.price * product.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                .replace(/,/g, ".").replace(/₫/, "VNĐ")}</div>
                            </div>
                        </div>
                        <div class="remove-product" onclick="removeProduct(${product.id}, ${product.cartId
              }, ${product.product.price}, ${product.quantity})">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    `;
          })
          .join("");
        const cartId = products[0].cartId;
        updatePaymentDetails(cartId);
      } else {
        // Render a message for an empty cart
        productsContainer.innerHTML = `
        <div class="modal-content">
         <div class="center-content">
                <div class="title">OOPSS...</div>
                <div class="message">
                    Giỏ hàng hiện đang trống <br >
                    Không có sản phẩm nào trong<br >
                    giỏ của bạn
                </div>
                <div class="button">
                <div  class="button button-dark button-small mt-6 nuxt-link-exact-active nuxt-link-active">
                    Tiếp tục mua sắm
                </div>
                </div>
            </div>
        </div>
       `;
      }
    } else {
      console.error("Không tìm thấy phần tử .products-payment");
    }
  } catch (error) {
    console.error("Lỗi khi hiển thị sản phẩm:", error);
  }
}
showItems();
async function updateQuantityProduct(action, id, price) {
  event.preventDefault();
  const cartItem = await fetch(
    `http://localhost:3000/api/cartItems/${id}`
  ).then((response) => response.json());
  updatePaymentDetails(cartItem.cartId);
  let newQuantity = cartItem.quantity;
  if (action === "increase") {
    newQuantity++;
  } else if (action === "decrease" && newQuantity > 1) {
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
    priceElement.innerHTML = (newQuantity * price).toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace(/,/g, ".").replace(/₫/, "VNĐ");
  }
}

async function calculateTotalOriginal(cartId) {
  try {
    const products = await fetch(
      `http://localhost:3000/api/cartItems?cartId=${cartId}&_expand=product`
    ).then((res) => res.json());

    if (products.length === 0) {
      return 0;
    } else {
      const totalOriginal = products.reduce(
        (total, product) => {
          const productTotal = product.product.price * product.quantity;
          return total + productTotal;
        },
        0
      );
      return totalOriginal;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}
async function updatePaymentDetails(cartId) {
  try {
    const totalOriginal = await calculateTotalOriginal(cartId);

    const products = await fetch(
      `http://localhost:3000/api/cartItems?cartId=${cartId}&_expand=product`
    ).then((res) => res.json());

    if (products.length === 0) {
      document.querySelector(".provisional-card .provisional:nth-child(1) p").textContent = `0 đ`;
      document.querySelector(".provisional-card .provisional:nth-child(2) p").textContent = `0 đ`;
      document.querySelector(".order .total span").textContent = `0 Đ`;
    } else {
      const provisionalAmount = products.reduce(
        (total, product) => {
          const discountPrice = (product.product.price * product.product.discount) / 100;
          const discountedPrice = product.product.price - discountPrice;
          const productTotal = discountedPrice * product.quantity;

          const originalPrice = product.product.price * product.quantity;

          return {
            provisionalAmount: total.provisionalAmount + productTotal,
            totalOriginal: total.totalOriginal + originalPrice,
            totalDiscount: total.totalDiscount + discountPrice * product.quantity,
          };
        },
        { provisionalAmount: 0, totalOriginal: 0, totalDiscount: 0 }
      );

      document.querySelector(".provisional-card .provisional:nth-child(1) p").textContent = `${totalOriginal.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace(/,/g, ".").replace(/₫/, "VNĐ")}`;
      document.querySelector(".provisional-card .provisional:nth-child(2) p").textContent = `${provisionalAmount.totalDiscount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace(/,/g, ".").replace(/₫/, "VNĐ")}`;

      const totalAmount = provisionalAmount.provisionalAmount;

      document.querySelector(".order .total span").textContent = `${totalAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace(/,/g, ".").replace(/₫/, "VNĐ")}`;
    }
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
    showItems();

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
   function momodal(){
      document.getElementById("nenmodal-1").classList.toggle("active");
   }
                                  
document.addEventListener("DOMContentLoaded", function () {
  showItems();
});
showItems();