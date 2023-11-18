
document.addEventListener("DOMContentLoaded", fetchDataAndPopulateTable());
function fetchDataAndPopulateTable() {
fetch(`http://localhost:3000/api/orders?_expand=user`)
    .then((response) => response.json())
    .then((data) => {
        let totalRevenue = 0;
        ordersTableBody = document.getElementById("ordersTableBody");
        ordersTableBody.innerHTML = "";

    data.forEach((order) => {
        const row = ordersTableBody.insertRow();
        const idCell = row.insertCell(0);
        const customerCell = row.insertCell(1);
        const inforCell = row.insertCell(2);
        const itemsCell = row.insertCell(3);
        const totalCell = row.insertCell(4);

        idCell.textContent = order.id;
        customerCell.innerHTML = `${order.user.username} <br> (${order.user.email})`;
        inforCell.innerHTML = `${order.customerInfo.username} (${order.customerInfo.phoneNumber}) <br> ${order.customerInfo.addr} , ${order.customerInfo.ward} , ${order.customerInfo.district} , ${order.customerInfo.city}`;
        if (order.itemsDetails && order.itemsDetails.length > 0) {
            itemsCell.innerHTML = order.itemsDetails.map(item => `${item.quantity} ${item.productName}`).join('<br>');
        } else {
            itemsCell.textContent = 'No items';
        }
        totalCell.textContent = order.total;
        totalRevenue += order.total;

    });
    document.getElementById("totalRevenue").textContent = totalRevenue;
    })
    .catch((error) => {
    console.error("Lỗi khi lấy dữ liệu từ API: ", error);
    });
}
function logoutUser() {
    const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.clear();
            window.location.href = "/";
        }
return false;
}
