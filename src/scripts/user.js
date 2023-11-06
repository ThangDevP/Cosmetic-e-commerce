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

function editUserInfo() {
  const editForm = document.getElementById("edit-form");
  editForm.style.display = "block";
}

function saveUserInfo() {
  const newName = document.getElementById("new-full-name").value;
  const newEmail = document.getElementById("new-email").value;
  const newPassword = document.getElementById("new-password").value;

  const data = { username: newEmail, password: newPassword };

  fetch(`http://localhost:3000/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
      // Reload the page to reflect the changes
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
