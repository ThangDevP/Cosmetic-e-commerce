const currentURL = window.location.href;
const segments = currentURL.split("/");
const userId = segments[segments.length - 1];

let profilePic = document.getElementById("profile-pic");
let inputFile = document.getElementById("image-file");
inputFile.onchange = function() {
  profilePic.src = URL.createObjectURL(inputFile.files[0]);
}

fetch(`http://localhost:3000/api/users/${userId}`)
  .then((response) => response.json())
  .then((user) => {
    console.log(user)
    document.getElementById("email").value = user.email;
    document.getElementById("profile-pic").src = "/" + user.avatar;
    document.getElementById("fullName").value = user.username;
    document.getElementById("phoneNumber").value = user.phoneNumber;
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });



