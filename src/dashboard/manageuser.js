document.addEventListener("DOMContentLoaded", fetchDataAndPopulateTable);

function fetchDataAndPopulateTable() {
  const role = "user"; // Đặt giá trị role bạn muốn fetch
  fetch(`http://localhost:3000/api/users?role=${role}`)
    .then((response) => response.json())
    .then((data) => {
      const userTableBody = document.getElementById("userTableBody");
      userTableBody.innerHTML = ""; // Xóa dữ liệu cũ trong bảng

      data.forEach((user) => {
        const row = userTableBody.insertRow();
        const avatarCell = row.insertCell(0);
        const fullNameCell = row.insertCell(1);
        const emailCell = row.insertCell(2);
        const dobCell = row.insertCell(3)
        const phoneNumberCell = row.insertCell(4);
        const actionCell = row.insertCell(5);

        fullNameCell.textContent = user.username;
        emailCell.textContent = user.email;
        avatarCell.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 60px; height: 60px;">`;
        phoneNumberCell.textContent = user.phoneNumber || "";
        dobCell.textContent = user.dob || "";

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.className = "update-button"; // Đặt class cho nút Update
        updateButton.setAttribute("data-bs-toggle", "modal");
        updateButton.setAttribute("data-bs-target", "#myModal");
        updateButton.addEventListener("click", () => {
          console.log("Update button clicked");
          const userId = user.id;
          fetchAndPopulateUserData(userId);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button"; // Đặt class cho nút Delete
        deleteButton.addEventListener("click", () => {
          const userId = user.id;
          fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(() => {
              const rowToDelete = deleteButton.closest("tr");
              rowToDelete.remove();
            })
            .catch((error) => {
              console.error("Lỗi khi xóa user: ", error);
            });
        });

        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu từ API: ", error);
    });
}

function fetchAndPopulateUserData(userId) {
  fetch(`http://localhost:3000/api/users/${userId}`)
    .then((response) => response.json())
    .then((userData) => {
      const modal = document.getElementById("myModal");
      const userIDInput = modal.querySelector("#userID");
      const usernameInput = modal.querySelector("#username");
      const emailInput = modal.querySelector("#email");
      const addressInput = modal.querySelector("#address");
      const phoneNumberInput = modal.querySelector("#phoneNumber");
      const avatarInput = modal.querySelector("#avatar");
      const previewImage = modal.querySelector("#previewImage"); // Add this line

      userIDInput.value = userData.id;
      usernameInput.value = userData.username;
      emailInput.value = userData.email;
      addressInput.value = userData.address;
      phoneNumberInput.value = userData.phoneNumber;
      previewImage.src = userData.avatar || "/1.jpg"; // Change "/1.jpg" to your default image URL

      // Update modal for the new avatar input
       // Update modal for the new avatar input
       avatarInput.value = userData.avatar;
       previewImage.src = userData.avatar; // Set the source of the preview image

       const myModal = new bootstrap.Modal(modal);
       myModal.show();
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu người dùng: ", error);
    });
}

async function handleUpload(avatarInput, folderName) {
  if (avatarInput.files.length > 0) {
      // Create a new FormData just for Cloudinary upload
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", avatarInput.files[0]); // Cloudinary expects 'file' as the parameter name
      cloudinaryFormData.append("folder", folderName); // Specify the folder name

      const uploadPreset = "zjyg5sbx"; // Replace with your actual upload preset name

      // Gửi file avatar lên Cloudinary
      return fetch(
          `https://api.cloudinary.com/v1_1/darhyd9z6/upload?upload_preset=${uploadPreset}`,
          {
              method: "POST",
              body: cloudinaryFormData, // Send the new FormData specifically for Cloudinary
          }
      )
          .then((response) => response.json())
          .then((cloudinaryData) => {
              return cloudinaryData.secure_url;
          });
  }
}
async function handleImageChange() {
  const avatarInput = document.getElementById("avatar");
  const previewImage = document.getElementById("previewImage");

  if (avatarInput.files.length > 0) {
      const imageUrl = await handleUpload(avatarInput, "users");
      previewImage.src = imageUrl; // Set the source of the preview image to the uploaded image
  }
}
async function handleAddOrUpdateUser() {
  const userId = document.getElementById("userID").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const avatarInput = document.getElementById("avatar");

  try {
      // Lấy giá trị cũ của người dùng
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      const oldUserData = await response.json();

      // Thực hiện kiểm tra xem có đủ thông tin hay không
      if (!username || !email || !address || !phoneNumber || !oldUserData) {
          alert("Vui lòng nhập đầy đủ thông tin.");
          return;
      }

      const urlImage = await handleUpload(avatarInput, "users");

      // Update user data
      const updatedUserData = {
          username,
          email,
          address,
          phoneNumber,
          avatar: urlImage || oldUserData.avatar,
          role: oldUserData.role,
          gender: oldUserData.gender,
          dob: oldUserData.dob,
          password: oldUserData.password // Giữ nguyên giá trị cũ của role
      };

      // Gửi yêu cầu cập nhật người dùng đến API
      const apiUrl = `http://localhost:3000/api/users/${userId}`;
      const apiResponse = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserData),
      });

      if (!apiResponse.ok) {
          throw new Error(`HTTP error! Status: ${apiResponse.status}`);
      }

      const responseData = await apiResponse.json();
      console.log("API response:", responseData);
      // Refresh bảng để hiển thị thông tin mới
      fetchDataAndPopulateTable();
      previewImage.src = urlImage || oldUserData.avatar;

  } catch (error) {
      console.error("Lỗi khi cập nhật người dùng: ", error);
  }
}

const addButton = document.querySelector(".view");
addButton.addEventListener("click", () => {
  handleAddOrUpdateUser();
});
function logoutUser() {
  // Display a confirmation dialog
  const confirmLogout = confirm('Are you sure you want to logout?');

  // If the user confirms, proceed with logout
  if (confirmLogout) {
      // Clear localStorage
      localStorage.clear();

      // Redirect the user to the home page ("/" in this case)
      window.location.href = "/";
  }
  
  // If the user cancels, do nothing
  return false;
}

