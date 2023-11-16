userId = localStorage.getItem('userID');

let profilePic = document.getElementById("profile-pic");
let inputFile = document.getElementById("image-file");
var imageFile;
inputFile.onchange = async function () {
  if (inputFile.files.length > 0) {
    imageFile = await handleUpload(inputFile, "users");
    profilePic.src = imageFile;
    console.log(profilePic.src);
  }
};

async function handleUpload(avatarInput, folderName) {
  if (avatarInput.files.length > 0) {
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", avatarInput.files[0]);
    cloudinaryFormData.append("folder", folderName);

    const uploadPreset = "zjyg5sbx";

    // Gửi file avatar lên Cloudinary
    return fetch(
      `https://api.cloudinary.com/v1_1/darhyd9z6/upload?upload_preset=${uploadPreset}`,
      {
        method: "POST",
        body: cloudinaryFormData, // Send the new FormData specifically for Cloudinary
      }
    )
      .then((response) => response.json())
      .then((cloudinaryData) => {
        return cloudinaryData.secure_url;
      });
  }
}

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
    document.getElementById("address").value = user.address;
    var cities = document.getElementById("city");
    var districts = document.getElementById("district");
    var wards = document.getElementById("ward");

    const apiEndpoint =
      "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json";
    const getData = async () => {
      try {
        var promise = await fetch(apiEndpoint);
        const data = await promise.json();
        renderCity(data); // Gọi renderCity sau khi lấy dữ liệu
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    getData();

    function renderCity(data) {
      for (const p of data) {
        var opt = document.createElement("option");
        opt.value = p.Id;
        opt.text = p.Name;
        if (p.Id === user.city) {
          opt.selected = true;
        }
        opt.setAttribute("data-id", p.Id);
        cities.options.add(opt);
      }
      selectedCityId =
        cities.options[cities.selectedIndex].getAttribute("data-id");
      function listDistrict(selectedCityId) {
        districts.length = 1;
        wards.length = 1;
        if (selectedCityId !== "") {
          const result = data.filter((n) => n.Id === selectedCityId);

          for (const d of result[0].Districts) {
            var opt = document.createElement("option");
            opt.value = d.Id;
            opt.text = d.Name;
            if (d.Id === user.district) {
              opt.selected = true;
            }
            opt.setAttribute("data-id", d.Id);
            districts.options.add(opt);
          }
        }
      }
      listDistrict(selectedCityId);
      dataCity = data.filter((n) => n.Id === selectedCityId);
      selectedDistrictId =
        districts.options[districts.selectedIndex].getAttribute("data-id");
      function listWard(selectedDistrictId) {
        wards.length = 1;
        if (selectedDistrictId !== "") {
          const dataWards = dataCity[0].Districts.filter(
            (n) => n.Id === selectedDistrictId
          )[0].Wards;
          for (const w of dataWards) {
            var opt = document.createElement("option");
            opt.value = w.Id;
            opt.text = w.Name;
            if (w.Id === user.ward) {
              opt.selected = true;
            }
            opt.setAttribute("data-id", w.Id);
            wards.options.add(opt);
          }
        }
      }
      listWard(selectedDistrictId);

      cities.onchange = function () {
        districts.length = 1;
        wards.length = 1;
        const selectedCityId =
          this.options[this.selectedIndex].getAttribute("data-id");

        if (selectedCityId !== "") {
          const result = data.filter((n) => n.Id === selectedCityId);

          for (const d of result[0].Districts) {
            var opt = document.createElement("option");
            opt.value = d.Id;
            opt.text = d.Name;
            opt.setAttribute("data-id", d.Id);
            districts.options.add(opt);
          }
        }
      };

      districts.onchange = function () {
        wards.length = 1;
        const selectedCityId =
          cities.options[cities.selectedIndex].getAttribute("data-id");

        if (this.options[this.selectedIndex].dataset.id !== "") {
          const dataCity = data.filter((n) => n.Id === selectedCityId);
          const selectedDistrictId =
            this.options[this.selectedIndex].getAttribute("data-id");

          if (selectedDistrictId !== "") {
            const dataWards = dataCity[0].Districts.filter(
              (n) => n.Id === selectedDistrictId
            )[0].Wards;
            for (const w of dataWards) {
              var opt = document.createElement("option");
              opt.value = w.Id;
              opt.text = w.Name;
              opt.setAttribute("data-id", w.Id);
              wards.options.add(opt);
            }
          }
        }
      };
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

        var address = document.getElementById("address").value
          ? document.getElementById("address").value
          : user.address;

        var cities = document.getElementById("city");
        var citySelected;
        for (let i = 0; i < cities.options.length; i++) {
          if (cities.options[i].selected) {
            citySelected = cities.options[i].value;
            break;
          }
        }
        var districts = document.getElementById("district");
        var districtSelected;
        for (let i = 0; i < districts.options.length; i++) {
          if (districts.options[i].selected) {
            districtSelected = districts.options[i].value;
            break;
          }
        }
        var wards = document.getElementById("ward");
        var wardSelected;
        for (let i = 0; i < wards.options.length; i++) {
          if (wards.options[i].selected) {
            wardSelected = wards.options[i].value;
            break;
          }
        }

        if (password !== user.password && password !== null) {
          alert("Wrong password");
          return;
        } else if (newPassword !== confirmPassword) {
          newPassword = user.password;
          confirmPassword = user.password;
        }

        const update = {
          id: userId,
          username: fullName,
          password: newPassword,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
          city: citySelected,
          district: districtSelected,
          ward: wardSelected,
          avatar: image,
          role: "user",
          dob: dob,
          gender: genderSelected,
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

    alert("Update successful");
  });
