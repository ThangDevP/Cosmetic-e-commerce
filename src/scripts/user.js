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
    const email = document.getElementById("email").value = user.email;
    const image = document.getElementById("profile-pic").src = "/" + user.avatar;
    const fullName = document.getElementById("fullName").value = user.username;
    const birthday = document.getElementById("dob").value = user.birthday;
    const phone = document.getElementById("phoneNumber").value = user.phone;
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




// fetch(`http://localhost:3000/api/users/${userId}`)
//   .then((response) => response.json())
//   .then((user) => {
//     console.log(user);
//     const fullNameElement = document.getElementById("fullname");
//     const emailElement = document.getElementById("email");
//     const phoneElement = document.getElementById("phone");
//     const birthdayElement = document.getElementById("birthday");
//     const passwordElement = document.getElementById("password");
//     const genderSelect = document.getElementById("gender");
//     const imageElement = document.getElementById("profile-pic");
    

//     fullNameElement.innerHTML = `<input type="text" id="new-full-name" value="${user.username}" />`;
//     emailElement.innerHTML = `<input type="text" id="new-email" value="${user.email}" />`;
//     phoneElement.innerHTML = `<input type="number" id="new-phone" value="${user.phone}" />`;

//     birthdayElement.innerHTML =  `<input type="birthday" id="new-birthday" value="${user.birthday}" />`;

//     passwordElement.innerHTML = `<input type="test" id="new-password" value="${user.password}" />`;

//     // Populate the gender options
//     const genders = ["Nam", "Nữ", "Khác"];
//     genders.forEach((gender) => {
//       const optionElement = document.createElement("option");
//       optionElement.value = gender.toLowerCase();
//       optionElement.textContent = gender;
//       genderSelect.appendChild(optionElement);
//     });

//    // Check if the user has an image
//    if (user.image) {
//     // Set the inner HTML of imageElement to contain an img tag
//     imageElement.src= "/" + user.image;
//   } else {
//     // Set a default image or handle the case where there is no image
//     imageElement.innerHTML = `<img src="default-image-url.jpg" alt="Profile Image" />`;
//   }
  

//   if (user.gender) {
//     genderSelect.value = user.gender.toLowerCase();
//   }
// })
// .catch((error) => {
//   console.error("Error fetching user data:", error);
// });


// const emailRegex = /@.*\./;
// const phoneRegex = /^\d{10}$/; // Kiểm tra xem có đủ 10 số không
// const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[0-2])[-/]\d{4}$/; // Kiểm tra định dạng dd-mm-yyyy hoặc dd/mm/yyyy
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/; // Kiểm tra mật khẩu

// function saveUserInfo() {

//   const imgInput = document.getElementById('image-file');
//   const newName = document.getElementById("new-full-name").value;
//   const newEmail = document.getElementById("new-email").value;
//   const newPhone = document.getElementById("new-phone").value;
//   const newGender = document.getElementById("gender").value;
//   const newBirthday = document.getElementById("new-birthday").value;
//   const newPassword = document.getElementById("new-password").value;
 

//   const emailErrorElement = document.getElementById("email-error");
//   const phoneErrorElement = document.getElementById("phone-error");
//   const birthdayErrorElement = document.getElementById("birthday-error");
//   const passwordErrorElement = document.getElementById("password-error");

//   // Kiểm tra email
//   if (!emailRegex.test(newEmail)) {
//     emailErrorElement.innerText = "Vui lòng nhập địa chỉ email hợp lệ !";
//     return;
//   } else {
//     emailErrorElement.innerText = "";
//   }

//   // Kiểm tra số điện thoại
//   if (!phoneRegex.test(newPhone)) {
//     phoneErrorElement.innerText = "Vui lòng nhập số điện thoại hợp lệ! (10 số).";
//     return;
//   } else {
//     phoneErrorElement.innerText = "";
//   }

//   // Kiểm tra ngày sinh
//   if (!dateRegex.test(newBirthday)) {
//     birthdayErrorElement.innerText = "Vui lòng nhập ngày sinh hợp lệ !";
//     return;
//   } else {
//     birthdayErrorElement.innerText = "";
//   }

//   // Kiểm tra mật khẩu
//   if (!passwordRegex.test(newPassword)) {
//     passwordErrorElement.innerText = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ thường, chữ hoa, số và ký tự đặt biệt.";
//     return;
//   } else {
//     passwordErrorElement.innerText = "";
//   }
//   const data = {
//     image: newImage,
//     username: newName,
//     email: newEmail,
//     phone: newPhone,
//     gender: newGender,
//     birthday: newBirthday,
//     password: newPassword,
//   };

//   fetch(`http://localhost:3000/api/users/${userId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       console.log("Success:", result);
//       location.reload();
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }


// let id = 1; // initialize the ID counter
//   fetch("/api/history") // Fetch the purchase history data
//       .then((response) => response.json())
//       .then((historyData) => {
//           const historyTable = document.getElementById("history-table");

//           historyData.forEach((purchase) => {
//               const row = historyTable.insertRow();
//               const idCell = row.insertCell(0); // Insert the ID cell
//               const dateCell = row.insertCell(1);
//               const detailsCell = row.insertCell(2);
//               const amountCell = row.insertCell(3);
//               const purchaseAmountCell = row.insertCell(4); // New cell for the "purchaseAmount"

//               idCell.textContent = id; // Add the ID to the cell
//               dateCell.textContent = purchase.purchaseDate;
//               detailsCell.textContent = purchase.purchaseDetails;
//               amountCell.textContent = purchase.amount; // Display the "amount" in the table
//               purchaseAmountCell.textContent = `$${purchase.purchaseAmount}`;

//               id++; // increment the ID for the next row
//           });
//       })
//       .catch((error) => {
//           console.error("Error fetching purchase history: ", error);
//       });


      // let birthdayVisible = true; // Set the initial state to true

      // function ToggleBirthdayVisibility() {
      //   const birthdayInput = document.getElementById("new-password");
      //   if (!birthdayVisible) {
      //     birthdayInput.type = "text"; // If birthday is currently hidden, show it
      //     birthdayVisible = true;
      //   } else {
      //     birthdayInput.type = "password"; // If birthday is currently visible, hide it
      //     birthdayVisible = false;
      //   }
      // }
