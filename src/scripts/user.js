const currentURL = window.location.href;
const segments = currentURL.split("/");
const userId = segments[segments.length - 1];

let profilePic = document.getElementById("profile-pic");
let inputFile = document.getElementById("image-file");
var imageFile;
inputFile.onchange = function () {
  if (inputFile.files.length > 0) {
    imageFile = "/" + inputFile.files[0].name;
    profilePic.src = imageFile;
    console.log("Selected file path:", inputFile.files[0].name);
  }
};

fetch(`http://localhost:3000/api/users/${userId}`)
  .then((response) => response.json())
  .then((user) => {
    document.getElementById("email").value = user.email;
    document.getElementById("profile-pic").src = user.avatar;
    document.getElementById("fullName").value = user.username;
    document.getElementById("dob").value = user.dob;
    document.getElementById("phoneNumber").value = user.phoneNumber;
    const gender = document.getElementById("gender");
    for (let i = 0; i < gender.options.length; i++) {
      if (gender.options[i].value === user.gender) {
        gender.options[i].selected = true;
        break;
      }
    }
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
  });

document
  .getElementById("profile-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    fetch(`http://localhost:3000/api/users/${userId}`)
      .then((response) => response.json())
      .then((user) => {
        var email = document.getElementById("email").value
          ? document.getElementById("email").value
          : user.email;
        var password = document.getElementById("oldPassword").value
          ? document.getElementById("oldPassword").value
          : user.password;
        var newPassword = document.getElementById("newPassword").value
          ? document.getElementById("newPassword").value
          : "";
        var confirmPassword = document.getElementById("confirmPassword").value
          ? document.getElementById("confirmPassword").value
          : user.password;
        var fullName = document.getElementById("fullName").value
          ? document.getElementById("fullName").value
          : user.userName;
        var dob = document.getElementById("dob").value
          ? document.getElementById("dob").value
          : user.dob;
        var phoneNumber = document.getElementById("phoneNumber").value
          ? document.getElementById("phoneNumber").value
          : user.phone;
        var gender = document.getElementById("gender");
        var genderSelected;
        for (let i = 0; i < gender.options.length; i++) {
          if (gender.options[i].selected) {
            genderSelected = gender.options[i].value;
            break;
          }
        }
        var image = imageFile ? imageFile : user.avatar;



        if (password !== user.password && password !== null) {
          alert("Wrong password");
          return;
        } else if (newPassword !== confirmPassword) {
          newPassword = user.password;
          confirmPassword = user.password;
        }

        const update = {
          username: fullName,
          email: email,
          address: "Viet Nam",
          phoneNumber: phoneNumber,
          avatar: image,
          role: "user",
          gender: genderSelected,
          dob: dob,
          password: newPassword,
          id: userId,
        };
        fetch(`http://localhost:3000/api/users/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(update),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log("Success:", result);
            location.reload();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });

      alert('Update successful');
  });