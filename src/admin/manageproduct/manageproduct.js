const productImageInput = document.getElementById("product-image");

productImageInput.addEventListener("change", (e) => {
    // Lấy hình ảnh đã chọn
    const selectedImage = e.target.files[0];

    // Hiển thị tên tệp hình ảnh đã chọn
    const fileNameDisplay = document.getElementById("file-name-display");
    fileNameDisplay.textContent = selectedImage.name;
});
