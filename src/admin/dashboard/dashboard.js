document.addEventListener("DOMContentLoaded", function () {

    // Check if user name exists in local storage
    var name = localStorage.getItem("username");
    var userChange = document.getElementById("user-change");
    var subMenu = document.createElement("ul");
    subMenu.classList.add("sub-menu");
    subMenu.style.display = "none"; // Initially hide the submenu

    if (name) {
        // If user name is found in local storage, display it
        userChange.textContent = name;

        // Create and populate the sub-menu
        subMenu.innerHTML = `
            <li><a href="/profile">Hồ sơ người dùng</a></li>
            <li><a href="#" id="logout">Đăng xuất</a></li>
        `;

        userChange.appendChild(subMenu);

        // Event listener for showing the sub-menu
        userChange.addEventListener("mouseenter", function () {
            subMenu.style.display = "block";
        });

        // Event listener for hiding the sub-menu
        userChange.addEventListener("mouseleave", function () {
            subMenu.style.display = "none";
        });

        // Event listener for the logout button
        var logoutButton = document.getElementById("logout");
        logoutButton.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("username");
            userChange.textContent = "Đăng nhập";
            subMenu.style.display = "none";
        });
    } else {
        userChange.textContent = "Đăng nhập";
    }
});

function logoutUser() {
    // Display a confirmation dialog
    const confirmLogout = confirm("Are you sure you want to logout?");

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