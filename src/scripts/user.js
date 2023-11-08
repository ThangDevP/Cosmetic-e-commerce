const currentURL = window.location.href;
const segments = currentURL.split("/");
const userId = segments[segments.length - 1];

fetch(`http://localhost:3000/api/users/${userId}`)
  .then((response) => response.json())
  .then((user) => {
    console.log(user);
    const fullNameElement = document.getElementById("full-name");
    const emailElement = document.getElementById("email");
    const passwordElement = document.getElementById("password");

    fullNameElement.textContent = `Full Name: ${user.username}`;
    emailElement.textContent = `Email: ${user.username}`;
    passwordElement.textContent = `Password: ${user.password}`;
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });
