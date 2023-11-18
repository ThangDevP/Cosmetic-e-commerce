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
function fetchDataAndPopulateTable() {
  fetch(`http://localhost:3000/api/categories`)
    .then((response) => response.json())
    .then((data) => {
        const categoryCount = data.length;
        document.getElementById("categoryCount").textContent = categoryCount;
      const cateTableBody = document.getElementById("cateTableBody");
      cateTableBody.innerHTML = "";

      data.forEach((category) => {
        const row = cateTableBody.insertRow();
        const idCell = row.insertCell(0);
        const cateNameCell = row.insertCell(1);
        const cateDescriptionCell = row.insertCell(2);

        idCell.textContent = category.id;
        cateNameCell.textContent = category.cateName;
        cateDescriptionCell.textContent = category.cateDescription;

        const updateButton = document.createElement("a");
        updateButton.textContent = "Xem thêm";
        updateButton.className = "btn btn-sm btn-neutral";
        updateButton.href = "#";
        updateButton.setAttribute("data-bs-toggle", "modal");
        updateButton.setAttribute("data-bs-target", "#myModal");
        updateButton.addEventListener("click", () => {
          console.log("View button clicked");
          const categoryID = category.id;
          fetchAndPopulateUserData(categoryID);
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
          deleteModal.dataset.categoryID = category.id;
        });

        const deleteConfirmButton = document.querySelector(".deletebtn");
        deleteConfirmButton.addEventListener("click", () => {
          const categoryID = deleteModal.dataset.categoryID;

          fetch(`http://localhost:3000/api/categories/${categoryID}`, {
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
              const deleteModal = new bootstrap.Modal(
                document.getElementById("deleteModal")
              );
            })
            .catch((error) => {
              console.error("Lỗi khi xóa category: ", error);
            });
          fetchDataAndPopulateTable();
        });
        const actionCell = row.insertCell(3);
        actionCell.classList.add("text-end");
        actionCell.appendChild(updateButton);
        actionCell.appendChild(deleteButton);
      });
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu từ API: ", error);
    });
}

function fetchAndPopulateUserData(categoryID) {
  fetch(`http://localhost:3000/api/categories/${categoryID}`)
    .then((response) => response.json())
    .then((cateData) => {
      const modal = document.getElementById("myModal");
      const catIDInput = modal.querySelector("#update-cateID");
      const cateNameInput = modal.querySelector("#update-cateName");
      const cateDescriptionInput = modal.querySelector("#update-cateDescription");

      catIDInput.value = cateData.id;
      cateNameInput.value = cateData.cateName;
      cateDescriptionInput.value = cateData.cateDescription;

      const myModal = new bootstrap.Modal(modal);
      myModal.show();
    })
    .catch((error) => {
      console.error("Lỗi khi lấy dữ liệu người dùng: ", error);
    });
}
function handleAddCategory() {
    const addModal = new bootstrap.Modal(document.getElementById("addModal"));
    const cateNameInput = document.getElementById("cateName");
    const cateDescriptionInput = document.getElementById("cateDescription");
    const cateName = cateNameInput.value;
    const cateDescription = cateDescriptionInput.value;

    if (!cateName || !cateDescription) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const id = Date.now();
      const newCategory = {
      id,
      cateName,
      cateDescription,
    };
      fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        addModal.hide();
        fetchDataAndPopulateTable();
        cateNameInput.value = "";
        cateDescriptionInput.value = "";
      })
      .catch((error) => {
        console.error("Lỗi khi thêm mới category: ", error);
      });
  }
  
const addCategoryButton = document.querySelector(".adding");
addCategoryButton.addEventListener("click", handleAddCategory);


async function handleAddOrUpdateUser() {
    const cateID = document.getElementById("update-cateID").value;
    const cateName = document.getElementById("update-cateName").value;
    const cateDescription = document.getElementById("update-cateDescription").value;

    try {
        const response = await fetch(
            `http://localhost:3000/api/categories/${cateID}`
        );

        if (!cateName || !cateDescription) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const updatedCateData = {
            cateName,
            cateDescription,
        };

        const apiUrl = `http://localhost:3000/api/categories/${cateID}`;
        const apiResponse = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCateData),
        });
        if (!apiResponse.ok) {
            throw new Error(`HTTP error! Status: ${apiResponse.status}`);
        }

        const responseData = await apiResponse.json();
        console.log("API response:", responseData);
        myModal.hide();
        fetchDataAndPopulateTable();
    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng: ", error);
    }
}
  
const addButton = document.querySelector(".view");
addButton.addEventListener("click", () => {
  handleAddOrUpdateUser();
});
function logoutUser() {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    localStorage.clear();
    window.location.href = "/";
  }
  return false;
}
