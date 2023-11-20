document.addEventListener("DOMContentLoaded", function () {
  isAuthenticated()
    .then((isUserAuthenticated) => {
      if (isUserAuthenticated) {
        console.log('User is not authenticated');
      }
    })
    .catch(error => {
      console.error('Error checking authentication:', error);
    });
});

function isAuthenticated() {
  const userID = localStorage.getItem('userID');

  if (userID !== null) {
    fetch(`http://localhost:3000/api/users/${userID}`)
      .then(response => response.json())
      .then(user => {
        if (user && user.role === 'user') {
          window.location.href = '/';
        } else {
          fetchDataAndPopulateTable();
        }
      })
  }
}

async function fetchDataAndPopulateTable() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/orders?_expand=user"
    );
    const data = await response.json();
    const usersResponse = await fetch("http://localhost:3000/api/users");
    const usersData = await usersResponse.json();
    const filteredUsers = usersData.filter(user => user.role === "user");

    const ordersTableBody = document.getElementById("ordersTableBody");
    const totalRevenueElement = document.getElementById("totalRevenue");
    let totalRevenue = 0;

    const totalUsers = filteredUsers.length;
    const totalUserElement = document.getElementById("totalUser");
    totalUserElement.textContent = totalUsers;

    const totalOrders = data.length;
    const totalOrdersElement = document.getElementById("totalOrders");
    totalOrdersElement.textContent = totalOrders;

    for (const order of data) {
      const row = ordersTableBody.insertRow();
      const idCell = row.insertCell(0);
      const customerCell = row.insertCell(1);
      const inforCell = row.insertCell(2);
      const itemsCell = row.insertCell(3);
      const totalCell = row.insertCell(4);
      idCell.textContent = order.id;
      customerCell.innerHTML = `${order.user.username} <br> (${order.user.email})`;
      inforCell.innerHTML = `${order.customerInfo.username} (${order.customerInfo.phoneNumber}) <br> ${order.customerInfo.addr}, ${order.customerInfo.ward}, ${order.customerInfo.district}, ${order.customerInfo.city}`;
      let itemsDetailsHtml = "";
      for (const item of order.itemsDetails) {
        // Fetch product details for each item
        const productResponse = await fetch(
          `http://localhost:3000/api/products/${item.productId}`
        );
        const productData = await productResponse.json();

        const formattedPrice = item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(/,/g, '.').replace("₫", 'VNĐ');

        itemsDetailsHtml += `${item.quantity} ${productData.productName} <br>`;
      }
      itemsCell.innerHTML = itemsDetailsHtml || "No items";
      totalCell.textContent = order.total;
      totalRevenue += order.total;
    }
    totalRevenueElement.textContent = totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(/,/g, '.').replace("₫", 'VNĐ');
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API:", error);
  }
}
function logoutUser() {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.clear();
    window.location.href = "/";
  }
  return false;
}
