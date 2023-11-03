function fetchUserData() {
  fetch("http://localhost:3000/api/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Assuming you want to display the first user's information
      const user = data[0];

      if (user) {
        displayUserInfo(user);
      } else {
        console.error("User not found in the response.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
}

function displayUserInfo(user) {
  const fullNameElement = document.getElementById("full-name");
  const emailElement = document.getElementById("email");
  const passwordElement = document.getElementById("password");

  // Update the HTML elements with user information
  fullNameElement.textContent = `Full Name: ${user.username}`;
  emailElement.textContent = `Email: ${user.username}`;
  passwordElement.textContent = `Password: ${user.password}`;
}

fetchUserData();
