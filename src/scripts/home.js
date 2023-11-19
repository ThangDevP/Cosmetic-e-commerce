const brandContainer = document.querySelector(".brands--container");

async function fetchBrands() {
  try {
    const response = await fetch("http://localhost:3000/api/certificates");
    if (!response.ok) {
      throw new Error("Lỗi khi tải dữ liệu");
    }
    const brandsData = await response.json();
    displayBrands(brandsData);
  } catch (error) {
    console.error(error);
  }
}

function displayBrands(brands) {
  const brandRow = document.querySelector(".brand--row");
  brands.forEach((brand) => {
    const brandItem = document.createElement("div");
    brandItem.classList.add("col-4", "brands--items");
    brandItem.innerHTML = `
            <img src="${brand.img}" alt="${brand.name}">
            <h3>${brand.name}</h3>
            <p>${brand.description}</p>
        `;
    brandRow.appendChild(brandItem);
  });
}
fetchBrands();

function haha(id) {
  console.log(id, "adad");
}

//Slider product
async function fetchProductSale() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/products?_expand=brand&_expand=category"
    );
    if (!response.ok) {
      throw new Error("Lỗi khi tải dữ liệu");
    }
    const products = await response.json();
    await displaySlide(products);
  } catch (error) {
    console.error(error);
  }
}

async function displaySlide(products) {
  document.querySelector("#your-class-first").innerHTML = products
    .map((product) => {
      return `
      <div id="slider" class="slider-content">
        <a href="/products/${product.id}">
        <img src=${product.img} alt=""/>
        </a>
        <div class="slide-info">
          <div class="infor-text">
            <a href="/products/${product.id}">
            <h6>${product.productName}</h6>
            </a>
            <p>
            ${product.category.cateName}
            </p>
            <p class="text-amount">${product.price
              .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
              .replace(/,/g, ".").replace(/₫/, "VNĐ")}</p>
          </div>
          <div class="infor-btn">
            <button class="btn-add-card" onclick="haha(${product.id})" ><i class="fa-solid fa-cart-plus"></i></button>
          </div>
        </div>
      </div>
`;
    })
    .join("");
}



function updateProgressBar(total, currentSlide) {
  const totalSlider = $(".your-class #slider").length;
  var progressBarInnerWidth = $(".progress-bar-custom").width() / totalSlider;
  $(".progress-bar-inner-custom").width(progressBarInnerWidth);

  var progress = (currentSlide / (totalSlider - 1)) * 100;
  var newPosition =
    (progress / 100) *
    ($(".progress-bar-custom").width() - progressBarInnerWidth);

  $(".progress-bar-inner-custom").css(
    "transform",
    "translateX(" + (newPosition - 1) + "px)"
  );
}

//Slider home
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  console.log(slides);

  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}
