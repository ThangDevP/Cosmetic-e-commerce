const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Event listener for the login form
// Event listener for the login form
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Send a request to your JSON Server to check if the user exists.
    fetch(`http://localhost:3000/api/users?email=${email}&password=${password}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 1) {
          const userID = data[0].id;
          const username = data[0].username;
          const phoneNumber = data[0].phoneNumber;
          const address = data[0].address;
          const avatar = data[0].avatar;
          localStorage.setItem('userID', userID);
          localStorage.setItem('username', username);
          localStorage.setItem('email', email);
          localStorage.setItem('phoneNumber', phoneNumber);
          localStorage.setItem('address', address);
          localStorage.setItem('avatar', avatar);
           if (data[0].role === "user"){
            window.location.href = '/';
           } else {
            window.location.href = '/manageuser';
           }

           // Redirect to the home page
        } else {
          alert('Login failed. Check your username and password.');
        }
      })
      .catch((error) => {
        console.error('Login Error:', error);
      });
  });

  // Event listener for the registration form
  document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Send a POST request to add the user to the JSON Server.
    // Use the appropriate URL for registration.
    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Đăng kí thành công.') {
          // Registration successful
          alert('Đăng kí tài khoản thành công. Giờ bạn có thể đăng nhập.');
          window.location.href = '/login'; // Redirect to the login page
        } else if (data.message === 'Tài khoản này đã được sử dụng.') {
          // Username already exists
          alert('Đăng kí thất bại. Tài khoản này đã được sử dụng.');
        } else {
          alert('Đăng kí thất bại. Tài khoản này đã được sử dụng.');
        }
      })
      .catch((error) => {
        console.error('Đăng kí thất bại! ', error);
      });
  });



