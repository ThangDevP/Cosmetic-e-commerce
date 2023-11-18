function dropdownFunc() {
  var x = document.getElementById("dropdown_menu");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
function userName() {
  var userId = localStorage.getItem("userID");
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
  userName();
});

