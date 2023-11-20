

function validateFields() {
  const ten = document.getElementById('name').value.trim();
  const sodienthoai = document.getElementById('number').value.trim();
  const diachi = document.getElementById('address').value.trim();
  const thanhpho = document.getElementById('city').value.trim();
  const quan = document.getElementById('district').value.trim();
  const phuong = document.getElementById('ward').value.trim();

  if (ten === '' || sodienthoai === '' || diachi === '' || thanhpho === '' || quan === '' || phuong === '') {
    alert("Vui lòng điền vào");
    return false;
  } else {
    // Success()
    return true;
  }
  return true
}

function Success() {
  alert('Thanh toán thành công')
  setTimeout(function() {
    window.location.href = 'checkout.html'
  })
}

//city
var citis = document.getElementById("city");
var districts = document.getElementById("district");
var wards = document.getElementById("ward");

    // var Parameter = {
    //   url: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json", 
    //   method: "GET", 
    //   responseType: "application/json", 
    // };
const apiEndpoint = "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
const getData = async () => {
  try {
      var promise = await fetch(apiEndpoint);
      const data = await promise.json();
      console.log(data);
      renderCity(data); // Gọi renderCity sau khi lấy dữ liệu
  } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
  }
};
getData();

function renderCity(data) {
  for (const x of data) {
    var opt = document.createElement('option');
    opt.value = x.Name;
    opt.text = x.Name;
    opt.setAttribute('data-id', x.Id);
    citis.options.add(opt);
  }

  citis.onchange = function () {
    districts.length = 1;
    wards.length = 1;

    if (this.options[this.selectedIndex].dataset.id !== "") {
      const result = data.filter(n => n.Id === this.options[this.selectedIndex].dataset.id);

      for (const k of result[0].Districts) {
        var opt = document.createElement('option');
        opt.value = k.Name;
        opt.text = k.Name;
        opt.setAttribute('data-id', k.Id);
        districts.options.add(opt);
      }
    }
  };

  districts.onchange = function () {
    wards.length = 1;

    const dataCity = data.filter((n) => n.Id === citis.options[citis.selectedIndex].dataset.id);

    if (this.options[this.selectedIndex].dataset.id !== "") {
      const dataWards = dataCity[0].Districts.filter(n => n.Id === this.options[this.selectedIndex].dataset.id)[0].Wards;

      for (const w of dataWards) {
        var opt = document.createElement('option');
        opt.value = w.Name;
        opt.text = w.Name;
        opt.setAttribute('data-id', w.Id);
        wards.options.add(opt);
      }
    }
  };
}


const userId = localStorage.getItem("userID");
async function fetchCartItems() {
    try {
        const response = await fetch( 
            `/api/carts?userId=${userId}`,
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
                `/api/cartItems?cartId=${cart[0].id}&_expand=product`
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
async function        showItems() {
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
                                    <button class="btn-quantity decrease" onclick="updateQuantityProduct(&quot;decrease&quot;, ${
                                        product.id
                                    }, ${product.product.price}, this)">-</button>
                                    <div class="quantity-text" data-id="${product.id}">${
                        product.quantity
                    }</div>
                                    <button class="btn-quantity increase" onclick="updateQuantityProduct(&quot;increase&quot;, ${
                                        product.id
                                    }, ${product.product.price}, this)">+</button>
                                </div>
                                <div class="price" data-id="${product.id}">
                                ${product.product.price * product.quantity}đ</div>
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
                const cartId = products[0].cartId;
                updatePaymentDetails(cartId);
              } else {
                // Render a message for an empty cart
                productsContainer.innerHTML = `  <div class="message">
                <div class="title">OOPSS...</div>
                <div class="message">
                    Giỏ hàng hiện đang trống <br >
                    Không có sản phẩm nào trong<br >
                    giỏ của bạn
                </div>
                <div class="button button-dark button-small mt-6 nuxt-link-exact-active nuxt-link-active">
                    Tiếp tục mua sắm
                </div>
            </div>
        </div>`;
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
    `/api/cartItems/${id}`
  ).then((response) => response.json());
  updatePaymentDetails(cartItem.cartId);
  let newQuantity = cartItem.quantity;
  if (action === "increase") {
    newQuantity++;
  } else if (action === "decrease" && newQuantity > 1) {
    newQuantity--;
  }
  const response = await fetch(`/api/cartItems/${id}`, {
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

async function calculateTotalOriginal(cartId) {
  try {
    const products = await fetch(
      `/api/cartItems?cartId=${cartId}&_expand=product`
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
      `/api/cartItems?cartId=${cartId}&_expand=product`
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
      `/api/cartItems/${cartItemId}`,
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
document.addEventListener("DOMContentLoaded", function () {
    showItems();
});
showItems();  

// Fetch user data and populate form fields
fetch(`/api/users/${userId}`)
  .then((response) => response.json())
  .then((data) => {
    const emailInput = document.getElementById("email");  
    const nameInput = document.getElementById("name");
    const numberInput = document.getElementById("number");
    const addressInput = document.getElementById("address");

    fetch(apiEndpoint).then((response) => response.json())
    .then((address) => {
      for (const c of address) {
        console.log(c.Id, c.Name);
        if (c.Name == data.city) {
          var citySelect = document.getElementById("city");
          var matchingOption = Array.from(citySelect.options).find(
            (option) => option.getAttribute("data-id") === c.Id
          );

          if (matchingOption) {
            matchingOption.selected = true;
          }
        }
      }
              // Tiếp tục xử lý cho dropdowns "Quận" và "Phường"
              const districtSelect = document.getElementById("district");
              const wardSelect = document.getElementById("ward");
      
              // Xóa tất cả các lựa chọn hiện có trong dropdowns
              districtSelect.innerHTML = "";
              wardSelect.innerHTML = "";
      
              // Lấy thông tin Quận và Phường từ dữ liệu người dùng
              const selectedCity = address.find((c) => c.Name == data.city);
      
              // Xử lý Quận
              for (const district of selectedCity.Districts) {
                var districtOption = document.createElement('option');
                districtOption.value = district.Name;
                districtOption.text = district.Name;
                districtOption.setAttribute('data-id', district.Id);
                districtSelect.options.add(districtOption);
              }
      
              // Xử lý Phường
              const selectedDistrict = selectedCity.Districts.find((d) => d.Name == data.district);
              for (const ward of selectedDistrict.Wards) {
                var wardOption = document.createElement('option');
                wardOption.value = ward.Name;
                wardOption.text = ward.Name;
                wardOption.setAttribute('data-id', ward.Id);
                wardSelect.options.add(wardOption);
              }
      

    }); 

    emailInput.value = data.email;
    nameInput.value = data.username;
    numberInput.value = data.phoneNumber;
    addressInput.value = data.address;
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });

// Initialize customerInfo object with default values
const customerInfor = {
  email: "",
  username: "",
  phoneNumber: "",
  addr: "",
};

// Add event listener to the "Đặt Hàng" button
const addButton = document.querySelector(".btn-order");
if (addButton) {
  addButton.addEventListener("click", () => {
    // Update customerInfor with the latest input values
    customerInfor.email = document.getElementById("email").value;
    customerInfor.username = document.getElementById("name").value;
    customerInfor.phoneNumber = document.getElementById("number").value;
    customerInfor.addr = document.getElementById("address").value;

    const isFormValid = validateFields();

    if(isFormValid) {
    // Call the handleCheckout function
    handleCheckout();
    }
  });
}

async function clearCart(userId) {
  try {
    // Lấy thông tin giỏ hàng của người dùng
    const cart = await fetch(
      `/api/carts?userId=${userId}`
    ).then((response) => response.json());

    if (cart && cart.length > 0) {
      // Lấy tất cả các mục giỏ hàng của người dùng
      const cartItems = await fetch(
        `/api/cartItems?cartId=${cart[0].id}`
      ).then((response) => response.json());

      // Xóa toàn bộ mục giỏ hàng
      const deleteRequests = cartItems.map((item) =>
        fetch(`/api/cartItems/${item.id}`, {
          method: "DELETE",
        })
      );

      // Chờ tất cả các yêu cầu xóa được thực hiện
      await Promise.all(deleteRequests);

      // Cập nhật UI hoặc thực hiện bất kỳ hành động nào khác sau khi xóa thành công
      console.log("Đã xóa toàn bộ giỏ hàng.");
    }
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
  }
}

// Handle checkout logic
async function handleCheckout() {
  const itemsDetails = await fetchCartItems();
  console.log("item", itemsDetails);

    // Lấy giá trị từ các dropdowns thành phố, quận, và phường
    const selectedCity = document.getElementById("city").value;
    const selectedDistrict = document.getElementById("district").value;
    const selectedWard = document.getElementById("ward").value;
  
    // Đẩy vào đối tượng customerInfor
    customerInfor.city = selectedCity;
    customerInfor.district = selectedDistrict;
    customerInfor.ward = selectedWard;
  // Tính tổng tiền sau khi giảm giá của tất cả sản phẩm
  const totalAmountAfterDiscount = itemsDetails.reduce((total, product) => {
    const discountedPrice = product.product.price - (product.product.price * product.product.discount) / 100;
    return total + discountedPrice * product.quantity;
  }, 0);
  
  fetch("/api/orders", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      cartId: itemsDetails.length > 0 ? itemsDetails[0].cartId : null,
      customerInfo: customerInfor,
      email: customerInfor.email,
      itemsDetails: itemsDetails.map(product => ({
        productId: product.productId,
        productName: product.product.name,
        quantity: product.quantity,
        price: product.product.price,
        subtotal: product.product.price * product.quantity,
      })),
      total: totalAmountAfterDiscount,
    }),
  })
    .then(async (response) => {
      console.log('API Response:', response); 

      if (!response.ok) {
        alert('Tạo đơn hàng thất bại');
        return;
      }
      else {
        alert('Tạo đơn hàng thành công');
        try {
          const response = await fetch('/send-email-order-success', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: customerInfor.username,
              email: customerInfor.email,
              phoneNumber: customerInfor.phoneNumber,
              addr: customerInfor.addr,
              city: customerInfor.city,
              district: customerInfor.district,
              total: totalAmountAfterDiscount
            }),
          });
      
          // Xử lý kết quả từ server (nếu cần)
          const result = await response.json();
          console.log('Kết quả từ server:', result);

        } catch (error) {
          console.error('Lỗi khi gửi yêu cầu:', error);
        }
        await clearCart(userId); // Xóa giỏ hàng sau khi đặt hàng thành công   
        window.location.href = '/'; // Redirect to the login page
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}




