document.addEventListener("DOMContentLoaded", fetchDataAndPopulateTable);

function fetchDataAndPopulateTable() {
  const role = "product"; // Đặt giá trị role bạn muốn fetch
  fetch(`http://localhost:3000/api/products`)
    .then((response) => response.json())
    .then((data) => {
      const productTableBody = document.getElementById("productTableBody");
      productTableBody.innerHTML = ""; // Xóa dữ liệu cũ trong bảng

      data.forEach((product) => {
        const row = productTableBody.insertRow();
        const titleCell = row.insertCell(0);
        const productImgCell = row.insertCell(1);
        const productCatecCell = row.insertCell(2);
        const productPriceCell = row.insertCell(3);

        titleCell.textContent = product.name;
        productImgCell.innerHTML = `<img src="${product.img}" alt="Avatar" style="width: 150px; height: 150px;">`;
        productCatecCell.textContent = product.category;
        productPriceCell.textContent = product.price || "";

        const updateButton = document.createElement("a");
        updateButton.textContent = "Xem thêm";
        updateButton.className = "btn btn-sm btn-neutral";
        updateButton.href = "#";
        updateButton.setAttribute("data-bs-toggle", "modal");
        updateButton.setAttribute("data-bs-target", "#updateModal");
        updateButton.addEventListener("click", () => {
          console.log("View button clicked");
          const productId = product.id;
          fetchAndPopulateProductData(productId);
        });

        const deleteButton = document.createElement("a");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-sm btn-neutral";
        deleteButton.href = "#";
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deleteModal");
        deleteButton.innerHTML =
          '<span class="mt-1"><i class="bi bi-trash"></i></span';
        deleteButton.addEventListener("click", () => {
          // Lưu userId vào thuộc tính data để sử dụng trong modal
          deleteModal.dataset.productId = product.id;
        });

        // Xác nhận xóa
        const deleteConfirmButton = document.querySelector(".deletebtn");
        deleteConfirmButton.addEventListener("click", () => {
          // Lấy userId từ thuộc tính data
          const productId = deleteModal.dataset.productId;

          fetch(`http://localhost:3000/api/products/${productId}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(() => {
              const rowToDelete = deleteButton.closest("tr");
              rowToDelete.remove();
              deleteModal.hide();
              // Đóng modal xác nhận xóa
              const deleteModal = new bootstrap.Modal(
                document.getElementById("deleteModal")
              );
            })
            .catch((error) => {
              console.error("Lỗi khi xóa user: ", error);
            });
            fetchDataAndPopulateTable();
        });
        const actionCell = row.insertCell(4);
        actionCell.classList.add("text-end");
        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu từ API: ", error);
    });
}

function fetchAndPopulateProductData(productId) {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((productData) => {
      console.log("Product Data:", productData);
      const modal = document.getElementById("updateModal");
      const productIDInput = modal.querySelector("#productId");
      const productNameInput = modal.querySelector("#name");
      const productImgInput = modal.querySelector("#img");
      const productCateInput = modal.querySelector("#category");
      const productPriceInput = modal.querySelector("#price");
      const testImage = modal.querySelector("#testImage"); // Add this line

      // Populate form inputs with product data
      productIDInput.value = productData.id;
      productNameInput.value = productData.name;
      productCateInput.value = productData.category;
      productPriceInput.value = productData.price;

      // Set the source of the preview image (use a default image if avatar is not present)
      testImage.src = productData.img; // Change "/1.jpg" to your default image URL

      // Update modal for the new avatar input

      const updateModal = new bootstrap.Modal(modal);
      updateModal.show();
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
    });
}


async function handleUpload(productImgInput, folderName) {
  if (productImgInput.files.length > 0) {
    // Create a new FormData just for Cloudinary upload
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", productImgInput.files[0]); // Cloudinary expects 'file' as the parameter name
    cloudinaryFormData.append("folder", folderName); // Specify the folder name

    const uploadPreset = "zjyg5sbx"; // Replace with your actual upload preset name

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

async function handleImageChange() {
  const ImgInput = document.getElementById("img");
  const testImage = document.getElementById("testImage");

  if (ImgInput.files.length > 0) {
    const imageUrl = await handleUpload(ImgInput, "products");
    testImage.src = imageUrl; // Set the source of the preview image to the uploaded image
  }
}

async function handleAddOrUpdateProduct() {
  const productId = document.getElementById("productId").value;
  const productName = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const brandId = document.getElementById("brand-id").value;
  const ImgInput = document.getElementById("img");

  try {
    // Lấy giá trị cũ của người dùng
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const oldProductData = await response.json();

    // Thực hiện kiểm tra xem có đủ thông tin hay không
    if (!productName || !price || !oldProductData) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const urlImage = await handleUpload(ImgInput, "products");

    // Update user data
    const updateProductData = {
      productName,
      price,
      category,
      brandId,
      Img: urlImage || oldProductData.img,
      // Giữ nguyên giá trị cũ của role
    };

    // Gửi yêu cầu cập nhật người dùng đến API
    const apiUrl = `http://localhost:3000/api/products/${productId}`;
    const apiResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProductData),
    });
    if (!apiResponse.ok) {
      throw new Error(`HTTP error! Status: ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    console.log("API response:", responseData);
    // Refresh bảng để hiển thị thông tin mới
    
    fetchDataAndPopulateTable();
    previewImage.src = urlImage || oldProductData.img;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm: ", error);
  }
}

const addButton = document.querySelector(".view");
addButton.addEventListener("click", () => {
  console.log("testing")
  handleAddOrUpdateProduct();
});

function logoutUser() {
    // Display a confirmation dialog
    const confirmLogout = confirm("Are you sure you want to logout?");

    // If the user confirms, proceed with logout
    if (confirmLogout) {
      // Clear localStorage
        localStorage.clear();

      // Redirect the user to the home page ("/" in this case)
        window.location.href = "/";
    }

    // If the user cancels, do nothing
    return false;
}