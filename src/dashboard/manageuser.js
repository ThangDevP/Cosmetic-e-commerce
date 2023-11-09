document.addEventListener('DOMContentLoaded', fetchDataAndPopulateTable);

function fetchDataAndPopulateTable() {
    fetch('http://localhost:3000/api/users')
        .then((response) => response.json())
        .then((data) => {
            const userTableBody = document.getElementById('userTableBody');
            userTableBody.innerHTML = ''; // Xóa dữ liệu cũ trong bảng

            data.forEach((user) => {
                const row = userTableBody.insertRow();
                const fullNameCell = row.insertCell(0);
                const avatarCell = row.insertCell(1);
                const emailCell = row.insertCell(2);
                const phoneNumberCell = row.insertCell(3);
                const actionCell = row.insertCell(4);

                fullNameCell.textContent = user.username;
                // Các ô còn lại có thể được điền tương tự
                emailCell.textContent = user.email;
                avatarCell.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 60px; height: 60px;">`;
                phoneNumberCell.textContent = user.phoneNumber || '';

                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.className = 'update-button'; // Đặt class cho nút Update
                updateButton.addEventListener('click', () => {
                    // Xử lý sự kiện khi nút Update được nhấn
                    // Thêm mã JavaScript xử lý cập nhật dữ liệu ở đây
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button'; // Đặt class cho nút Delete
                deleteButton.addEventListener('click', () => {
                    // Xử lý sự kiện khi nút Delete được nhấn
                    // Thêm mã JavaScript xử lý xóa dữ liệu ở đây
                });

                actionCell.appendChild(updateButton);
                actionCell.appendChild(deleteButton);
            });
        })
        .catch((error) => {
            console.error('Lỗi khi lấy dữ liệu từ API: ', error);
        });
}
