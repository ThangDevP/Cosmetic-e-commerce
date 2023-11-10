
document.addEventListener('DOMContentLoaded', fetchDataAndPopulateTable);

function fetchDataAndPopulateTable() {
    const role = 'user'; // Đặt giá trị role bạn muốn fetch
    fetch(`http://localhost:3000/api/users?role=${role}`)
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
                emailCell.textContent = user.email;
                avatarCell.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 60px; height: 60px;">`;
                phoneNumberCell.textContent = user.phoneNumber || '';

                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.className = 'update-button'; // Đặt class cho nút Update
                updateButton.setAttribute('data-bs-toggle', 'modal');
                updateButton.setAttribute('data-bs-target', '#myModal');
                updateButton.addEventListener('click', () => {
                    console.log('Update button clicked');
                    const userId = user.id;
                    fetchAndPopulateUserData(userId);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button'; // Đặt class cho nút Delete
                deleteButton.addEventListener('click', () => {
                    const userId = user.id;
                    fetch(`http://localhost:3000/api/users/${userId}`, {
                        method: 'DELETE',
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(() => {
                        const rowToDelete = deleteButton.closest('tr');
                        rowToDelete.remove();
                    })
                    .catch((error) => {
                        console.error('Lỗi khi xóa user: ', error);
                    });
                });

                actionCell.appendChild(updateButton);
                actionCell.appendChild(deleteButton);
            });
        })
        .catch((error) => {
            console.error('Lỗi khi lấy dữ liệu từ API: ', error);
        });
}

function fetchAndPopulateUserData(userId) {
    fetch(`http://localhost:3000/api/users/${userId}`)
        .then((response) => response.json())
        .then((userData) => {
            const modal = document.getElementById('myModal');
            const userIDInput = modal.querySelector('#userID');
            const usernameInput = modal.querySelector('#username');
            const emailInput = modal.querySelector('#email');
            const addressInput = modal.querySelector('#address');
            const phoneNumberInput = modal.querySelector('#phoneNumber');
            const avatarInput = modal.querySelector('#avatar');
            userIDInput.value = userData.id;
            usernameInput.value = userData.username;
            emailInput.value = userData.email;
            addressInput.value = userData.address;
            phoneNumberInput.value = userData.phoneNumber;
            // Update modal for the new avatar input
            avatarInput.value = userData.avatar;

            const myModal = new bootstrap.Modal(modal);
            myModal.show();
        })
        .catch((error) => {
            console.error('Lỗi khi lấy dữ liệu người dùng: ', error);
        });
}
function getUserIdFromSelectedRow() {
    const selectedRow = document.querySelector('tr.selected');
    return selectedRow ? selectedRow.dataset.userId : null;
}


function handleAddOrUpdateUser() {
    const userId = document.getElementById('userID').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const avatarInput = document.getElementById('avatar');
    // Lấy giá trị cũ của người dùng
    fetch(`http://localhost:3000/api/users/${userId}`)
        .then((response) => response.json())
        .then((oldUserData) => {
            // Thực hiện kiểm tra xem có đủ thông tin hay không
            if (!username || !email || !address || !phoneNumber || !oldUserData) {
                alert('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            // Tạo một đối tượng chứa thông tin người dùng
            const userData = {
                username: username,
                email: email,
                address: address,
                phoneNumber: phoneNumber,
                avatar: avatarInput.files.length > 0 ? avatarInput.files[0].name : oldUserData.avatar,
                role: oldUserData.role,     // Giữ nguyên giá trị cũ của role
            };

            // Gửi yêu cầu cập nhật người dùng đến API
            const apiUrl = `http://localhost:3000/api/users/${userId}`;

            return fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Refresh bảng để hiển thị thông tin mới
            fetchDataAndPopulateTable();
        })
        .catch((error) => {
            console.error('Lỗi khi cập nhật người dùng: ', error);
        });
}

const addButton = document.querySelector('.view');
addButton.addEventListener('click', () => {
    handleAddOrUpdateUser();
});

