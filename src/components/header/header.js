

function dropdownFunc() {
  var x = document.getElementById("dropdown_menu");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function userName() {
    var name = localStorage.getItem('username');
    var userChange = document.getElementById('user-change');
    var dropdownContent = document.getElementById('dropdown-content');
    if (name) {
        userChange.textContent = name;

        // Create and populate the dropdown menu
        var dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu-item');

        var option1 = document.createElement('a');
        option1.href = '/profile'; // Set the URL or action for the first option
        option1.textContent = 'User profile';
        //style
        option1.style.padding = '12px 16px';
        option1.style.textDecoration = 'none';
        option1.style.display = 'block';
        option1.style.color = '#333';
        dropdownMenu.appendChild(option1);

        var option2 = document.createElement('a');
        option2.href = '#'; // Set the URL or action for the second option
        option2.textContent = 'Logout';
        // Apply CSS styles to option2
        option2.style.padding = '12px 16px';
        option2.style.textDecoration = 'none';
        option2.style.display = 'block';
        option2.style.color = '#333';
        dropdownMenu.appendChild(option2);

        // Apply CSS styles to the dropdown menu itself
        dropdownMenu.style.position = 'relative';
        dropdownMenu.style.display = 'inline-block';

        // Add the dropdown menu to the dropdown content
        dropdownContent.appendChild(dropdownMenu);
        option2.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent the link from navigating
            // Remove the 'username' item from localStorage
            localStorage.removeItem('username');
            // Update the userChange text
            userChange.textContent = "Đăng nhập";
        });
    } else {
        userChange.textContent = "Đăng nhập";
    }
    // if (name){
    //     document.getElementById('user-change').textContent = name;
    // } else {
    //     document.getElementById('user-change').textContent = "Đăng nhập";
    // }
}

