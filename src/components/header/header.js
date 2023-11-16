function dropdownFunc() {
  var x = document.getElementById("dropdown_menu");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}
function userName() {
  var name = localStorage.getItem("username");
  var userId = localStorage.getItem("userID");
  var userChange = document.getElementById("user-change");

  // Check if the user is logged in
  if (name) {
    // Create a new <a> element with the updated content
    
    var newA = document.createElement("a");
    newA.classList.add("active");
    newA.href = `user/${userId}`;
    newA.textContent = name;

    // Create and populate the sub-menu
    var subMenu = document.createElement("ul");
    subMenu.classList.add("sub-menu");
    subMenu.style.display = "none"; // Initially hide the submenu
    subMenu.innerHTML = `
      <li><a href="" id="user">Hồ sơ người dùng</a></li>
      <li><a href="" id="logout">Đăng xuất</a></li>
    `;

    // Add the new <a> element and sub-menu to the existing <li>
    userChange.innerHTML = ""; // Clear the existing content
    userChange.appendChild(newA);
    userChange.appendChild(subMenu);

    // Add event listener to hide the sub-menu when the cursor leaves "user-change"
    userChange.addEventListener("mouseleave", function () {
      subMenu.style.display = "none";
    });

    // Add event listener to show the sub-menu when hovering over "user-change"
    userChange.addEventListener("mouseenter", function () {
      subMenu.style.display = "block";
    });

    var userButton = document.getElementById("user");
    userButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = `/user/${userId}`;
    });

    // Event listener for the logout button
    var logoutButton = document.getElementById("logout");
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.clear();
      userName(); // Update the user interface
    });
  } else {
    // If the user is not logged in, reset the existing <li> content
    userChange.innerHTML =
      '<a class="active" href="/login">Đăng nhập</a>';
  }
}

// Call the userName function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  userName();
});
