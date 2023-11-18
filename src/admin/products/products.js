document.addEventListener("DOMContentLoaded", fetchDataAndPopulateTable);
const myModal = new bootstrap.Modal(document.getElementById("myModal"));
document.querySelector(".btn-close-myModal").addEventListener("click", () => {
  myModal.hide();
  document.querySelector(".modal-backdrop").remove();
});
document.addEventListener("DOMContentLoaded", fetchDataAndPopulateTable);
const addModal = new bootstrap.Modal(document.getElementById("addModal"));
document.querySelector(".btn-close-addModal").addEventListener("click", () => {
  addModal.hide();
  document.querySelector(".modal-backdrop").remove();
});
document.addEventListener("DOMContentLoaded", () => {
  fetchDataAndPopulateTable();
  populateCategoriesDropdown(); // Fetch and populate categories when the page loads
  populateBrandsDropdown(); // Fetch and populate categories when the page loads
  populateBrandsDropdownUpdate();
  populateCategoriesDropdownUpdate();

});

function fetchDataAndPopulateTable() {
  fetch(`http://localhost:3000/api/products?_expand=brand&_expand=category`)
    .then((response) => response.json())
    .then((data) => {
        const productCount = data.length;
        document.getElementById("productCount").textContent = productCount;
        ordersTableBody = document.getElementById("ordersTableBody");
      const productTableBody = document.getElementById("productTableBody");
      productTableBody.innerHTML = "";

      data.forEach((product) => {
        const row = productTableBody.insertRow();
        const imgCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const priceCell = row.insertCell(2);
        const categoryCell = row.insertCell(3);
        const brandCell = row.insertCell(4);
        const saleCell = row.insertCell(5)
        const discountCell = row.insertCell(6);

        imgCell.innerHTML = `<img src="${product.img}" alt="Product Image" style="width: 150px; height: 150px;">`;
        nameCell.textContent = product.name;
        priceCell.textContent = product.price;
        categoryCell.textContent = product.category.cateName;
        brandCell.textContent = product.brand.brandName;
        saleCell.textContent = product.sale;
        discountCell.textContent = product.discount;

        const updateButton = document.createElement("a");
        updateButton.textContent = "Xem thêm";
        updateButton.className = "btn btn-sm btn-neutral";
        updateButton.href = "#";
        updateButton.setAttribute("data-bs-toggle", "modal");
        updateButton.setAttribute("data-bs-target", "#myModal");
        updateButton.addEventListener("click", () => {
          console.log("View button clicked");
          const productID = product.id;
          fetchAndPopulateUserData(productID);
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
          deleteModal.dataset.productID = product.id;
        });
        const deleteConfirmButton = document.querySelector(".deletebtn");
        deleteConfirmButton.addEventListener("click", () => {
          const productID = deleteModal.dataset.productID;
          fetch(`http://localhost:3000/api/products/${productID}`, {
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
              console.error("Lỗi khi xóa category: ", error);
            });
          fetchDataAndPopulateTable();
        });
        const actionCell = row.insertCell(7);
        actionCell.classList.add("text-end");
        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu từ API: ", error);
    });
}
async function handleUpload(imageInput, folderName) {
    if (imageInput.files.length > 0) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", imageInput.files[0]);
      cloudinaryFormData.append("folder", folderName);
      const uploadPreset = "zjyg5sbx";
      return fetch(
        `https://api.cloudinary.com/v1_1/darhyd9z6/upload?upload_preset=${uploadPreset}`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      )
        .then((response) => response.json())
        .then((cloudinaryData) => {
          return cloudinaryData.secure_url;
        });
    }
  }

  async function handleImageChange() {
    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("previewImage");
    if (imageInput.files.length > 0) {
      try {
        const imageUrl = await handleUpload(imageInput, "products");
        previewImage.src = imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }

async function handleUploadUpdate(imageInput2, folderName) {
    if (imageInput2.files.length > 0) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", imageInput2.files[0]);
        cloudinaryFormData.append("folder", folderName);
        const uploadPreset = "zjyg5sbx";
        return fetch(
            `https://api.cloudinary.com/v1_1/darhyd9z6/upload?upload_preset=${uploadPreset}`,
            {
                method: "POST",
                body: cloudinaryFormData,
            }
        )
            .then((response) => response.json())
            .then((cloudinaryData) => {
                return cloudinaryData.secure_url;
            });
    }
}
async function handleImageChangeUpdate() {
  const imageInput2 = document.getElementById("update-image");
  const testImage = document.getElementById("testImage");
  if (imageInput2.files.length > 0) {
      try {
          const imageUrl2 = await handleUploadUpdate(imageInput2, "products");
          testImage.src = imageUrl2;
      } catch (error) {
          console.error("Error uploading image:", error);
      }
  }
}



function populateCategoriesDropdown() {
  const categoryDropdown = document.getElementById("category");
  fetch("http://localhost:3000/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((categories) => {
      categoryDropdown.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Hãy lựa chọn danh mục";
      categoryDropdown.appendChild(defaultOption);

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.cateName;
        categoryDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh mục: ", error);
    });
}
function populateCategoriesDropdownUpdate() {
  const categoryDropdown = document.getElementById("update-category");
  fetch("http://localhost:3000/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((categories) => {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.cateName;
        categoryDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh mục: ", error);
    });
}
function populateBrandsDropdown() {
  const brandDropdown = document.getElementById("brand");
  fetch("http://localhost:3000/api/brands")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((brands) => {
      brandDropdown.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Hãy lựa chọn thương hiệu";
      brandDropdown.appendChild(defaultOption);

      brands.forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand.id;
        option.textContent = brand.brandName;
        brandDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thương hiệu: ", error);
    });
}
function populateBrandsDropdownUpdate() {
  const brandDropdown = document.getElementById("update-brand");

  fetch("http://localhost:3000/api/brands")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((brands) => {
      brands.forEach((brand) => {
        const option = document.createElement("option");
        option.value = brand.id;
        option.textContent = brand.brandName;
        brandDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thương hiệu: ", error);
    });
}
function toggleDiscountInput() {
  const discountInput = document.getElementById('discount');
  const discountOptionYes = document.getElementById('discountOptionYes');

  if (discountOptionYes.checked) {
    discountInput.style.display = 'block';
  } else {
    discountInput.style.display = 'none';
  }
}
function toggleDiscountInputUpdate() {
  const discountInput = document.getElementById('update-discount');
  const discountOptionYes = document.getElementById('update-discountOptionYes');

  if (discountOptionYes.checked) {
    discountInput.style.display = 'block';
  } else {
    discountInput.style.display = 'none';
  }
}
async function handleAddProduct() {
  const addModal = new bootstrap.Modal(document.getElementById("addModal"));
  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const categoryInput = document.getElementById("category");
  const brandInput = document.getElementById("brand");
  const discountInput = document.getElementById("discount");
  const imageInput = document.getElementById("image");
  const discountOptionRadio = document.querySelector('input[name="discountOption"]:checked');
  const hasDiscount = discountOptionRadio ? discountOptionRadio.value === "yes" : false;

  const name = nameInput.value;
  const price = parseFloat(priceInput.value);
  const discount = discountInput.value;


  const selectedCategoryID = categoryInput.value;
  const selectedBrandID = brandInput.value;
  if (!name || !price || !selectedBrandID || !selectedCategoryID ) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  try {
    const imageUrl = await handleUpload(imageInput, "products");
    const img = imageUrl;
    const id = Date.now();
    const newProduct = {
      id,
      name,
      price,
      categoryId:selectedCategoryID,
      brandId: selectedBrandID,
      discount: hasDiscount ? parseFloat(discount) : 0,
      img,
      sale: hasDiscount,
    };
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("API response:", responseData);
    const previewImage = document.getElementById("previewImage");
    previewImage.src = "";
    categoryInput.value = "";
    brandInput.value = "";
    fetchDataAndPopulateTable();
    addModal.hide();
    nameInput.value = "";
    priceInput.value = "";
    discountInput.value = "";
    imageInput.value = "";
    } catch (error) {
    console.error("Error adding product:", error);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.querySelector(".view");
  submitButton.addEventListener("click", () => {
    console.log("Submit button clicked");
    handleAddProduct();
  });
});
  function fetchAndPopulateUserData(productID) {
    fetch(`http://localhost:3000/api/products/${productID}?_expand=brand&_expand=category`)
      .then((response) => response.json())
      .then((productData) => {
        console.log("Fetched Product Data:", productData);
        const modal = document.getElementById("myModal");
        const productIDInput = modal.querySelector("#update-productID");
        const nameInput = modal.querySelector("#update-name");
        const priceInput = modal.querySelector("#update-price");
        const cateInput = modal.querySelector("#update-category");
        const brandInput = modal.querySelector("#update-brand");
        const discountInput = modal.querySelector("#update-discount");
        const discountOptionYes = modal.querySelector("#update-discountOptionYes");
        const discountOptionNo = modal.querySelector("#update-discountOptionNo");
        const testImage = modal.querySelector("#testImage");
        productIDInput.value = productData.id;
        nameInput.value = productData.name;
        priceInput.value = productData.price;
        discountInput.value = productData.discount;
        testImage.src = productData.img;
        cateInput.value = productData.categoryId;
        brandInput.value = productData.brandId;
        if (productData.sale) {
          discountOptionYes.checked = true;
        } else {
          discountOptionNo.checked = true;
        }
        toggleDiscountInputUpdate();

        const myModal = new bootstrap.Modal(modal);
        myModal.show();
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu người dùng: ", error);
      });
  }

  async function handleUpdateProduct() {
    const productId = document.getElementById("update-productID").value;
    const name = document.getElementById("update-name").value;
    const price = parseFloat(document.getElementById("update-price").value);
    const categoryId = document.getElementById("update-category").value;
    const brandId = document.getElementById("update-brand").value;
    const discount = document.getElementById("update-discount").value;
    const discountOptionRadio = document.querySelector('input[name="discountOptionUpdate"]:checked');
    const hasDiscount = discountOptionRadio ? discountOptionRadio.value === "yes" : false;
    const imageInput2 = document.getElementById("update-image");
    try {
        // Lấy giá trị cũ của sản phẩm
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        const oldUserData = await response.json();

        // Thực hiện kiểm tra xem có đủ thông tin hay không
        if (!name || !price) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        // Upload the new image
        const imageUrl2 = await handleUploadUpdate(imageInput2, "products");
        testImage.src = imageUrl2;
        // Update product data
        const updatedProductData = {
            name,
            price,
            categoryId,
            brandId,
            discount: hasDiscount ? parseFloat(discount) : 0,
            sale: hasDiscount,
            img: imageUrl2 || oldUserData.img,
        };

        console.log("Updated Product Data:", updatedProductData);

        // Send the updated product data to the server
        const apiUrl = `http://localhost:3000/api/products/${productId}`;
        const apiResponse = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProductData),
        });

        if (!apiResponse.ok) {
            throw new Error(`HTTP error! Status: ${apiResponse.status}`);
        }

        const responseData = await apiResponse.json();
        console.log("API response:", responseData);

        myModal.hide();
        fetchDataAndPopulateTable();
        testImage.src = imageUrl2 || oldUserData.img;
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm: ", error);
    }
}


const updateButton = document.querySelector(".update");
updateButton.addEventListener("click", () => {
    handleUpdateProduct();
});

function logoutUser() {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.clear();
    window.location.href = "/";
  }
  return false;
}
