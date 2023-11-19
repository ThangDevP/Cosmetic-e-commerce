const currentURL = window.location.href;
let thisPage = 1;
let limit = 12;
var listProduct = document.getElementById('list_product');
var listCategoryFilter = document.getElementById('category_filter');
var listBrandFilter = document.getElementById('brand_filter');
let filter = document.querySelector('.search-by-filter')
let allProducts = []; // Biến để lưu trữ tất cả dữ liệu
let productFilter = []; // Biến để lưu trữ dữ liệu sau khi áp dụng bộ lọc
function fetchAndShowProduct(productFilter){
  fetch('/api/products?_expand=brand&_expand=category', {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
    .then(response => response.json())
    .then(json => {
      allProducts = json;
      productFilter = [...allProducts];
      showCategoryFilter(productFilter);
      showBrandFilter(productFilter);
      showProduct(productFilter);
      paginationProduct();
    })
    .catch(error => console.error('Error fetching data:', error));
}
fetchAndShowProduct();
showProduct(productFilter);
// Sửa hàm showProduct để lấy dữ liệu từ productFilter thay vì từ response của fetch
function showProduct(productFilter) {
  listProduct.innerHTML = '';
  productFilter.forEach(item => {
    const formattedPrice = item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace(/,/g, '.').replace("₫", 'VNĐ');
    let productDiv = document.createElement('div');
    productDiv.className = 'col-item';
    productDiv.innerHTML = `
      <div class="item-product">
        <a class="img-product" href="/products/${item.id}">
          <img src="${item.img}">
        </a>
        <div class="product-info">
          <div class="left">
            <div class="left-top">
              <div class="title-product">
                <a class="card-title" href="/products/${item.id}">${item.productName}</a>
              </div>
              <div class="category-product">
                <p>${item.category.cateName}</p>
              </div>
            </div>
            <div class="price-product">
              <p>${formattedPrice}</p>
            </div>
          </div>
          <div class="add-button">
            <a href="">
              <i class="fa-solid fa-cart-plus"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    listProduct.appendChild(productDiv);
  });
}
let selectedCategories = [];
function showCategoryFilter(productFilter) {
  listCategoryFilter.innerHTML = '<option value="">-- Tuỳ chọn --</option>';
  productFilter.forEach(item => {
    if (!selectedCategories.includes(item.category.cateName)) {
      listCategoryFilter.innerHTML += `
        <option value="${item.category.cateName}">${item.category.cateName}</option>
      `;
      selectedCategories.push(item.category.cateName); // Thêm danh mục vào mảng đã chọn
    }
  });
}
let selectedBrands = [];
function showBrandFilter(productFilter) {
  listBrandFilter.innerHTML = '<option value="">-- Tuỳ chọn --</option>';
  productFilter.forEach(item => {
    if (!selectedBrands.includes(item.brand.name)) {
      listBrandFilter.innerHTML += `
        <option value="${item.brand.name}">${item.brand.name}</option>
      `;
      selectedBrands.push(item.brand.name); // Thêm danh mục vào mảng đã chọn
    }
  });
}
//Search by filter ----------------- Status: Loading
filter.addEventListener('submit', function(event) {
  event.preventDefault();
  let valueFilter = event.target.elements;
  let nameFilterValue = valueFilter.name_filter.value.trim();
  let categoryFilterValue = valueFilter.category_filter.value.trim();
  let brandFilterValue = valueFilter.brand_filter.value.trim();
  let minPriceValue = parseFloat(valueFilter.minPrice.value);
  let maxPriceValue = parseFloat(valueFilter.maxPrice.value);
  if (nameFilterValue || categoryFilterValue || brandFilterValue || !isNaN(minPriceValue) || !isNaN(maxPriceValue)) {
      productFilter = allProducts.filter(item_filter => {
          const matchName = !nameFilterValue || item_filter.productName.toLowerCase().includes(nameFilterValue.toLowerCase());
          const matchCategory = !categoryFilterValue || item_filter.category.cateName.toLowerCase() === categoryFilterValue.toLowerCase();
          const matchBrand = !brandFilterValue || item_filter.brand.name.toLowerCase() === brandFilterValue.toLowerCase();
          // Check min price
          if (!isNaN(minPriceValue) && item_filter.price < minPriceValue) {
              return false;
          }
          // Check max price
          if (!isNaN(maxPriceValue) && item_filter.price > maxPriceValue) {
              return false;
          }
          return matchName && matchCategory && matchBrand;
      });
  } else {
      productFilter = [...allProducts];
  }
  showProduct(productFilter);
  paginationProduct();
  if (window.matchMedia('(max-width: 820px)').matches) {
    closeNav();
  }
});
const resetButton = document.getElementById('resetBtn');
resetButton.addEventListener('click', function() {
  document.getElementById('find').value = '';
  document.getElementById('category_filter').value = '';
  document.getElementById('brand_filter').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  showProduct(allProducts);
  paginationProduct();
  if (window.matchMedia('(max-width: 820px)').matches) {
    closeNav();
  }
});
// Pagination
function paginationProduct() {
  let list = document.querySelectorAll('.col-item');
  console.log(list, 'list');
  function loadItem() {
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    // let beginGet = limit * (thisPage - 1);
    // let endGet = Math.min(limit * thisPage - 1, list.length - 1);
    list.forEach((item, key) => {
      if (key >= beginGet && key <= endGet) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
    listPage();
  }
  loadItem();
  function listPage() {
    let count = Math.ceil(list.length / limit);
    console.log('Day la lenglist: ' + list.length);
    document.querySelector('.listPage').innerHTML = '';
    if (thisPage != 1) {
      let prev = document.createElement('li');
      prev.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
      prev.addEventListener('click', function () {
        changePage(thisPage - 1);
      });
      document.querySelector('.listPage').appendChild(prev);
    }
    for (let i = 1; i <= count; i++) {
      let newPage = document.createElement('li');
      newPage.innerText = i;
      if (i == thisPage) {
        newPage.classList.add('active');
      }
      newPage.addEventListener('click', function () {
        changePage(i);
      });
      document.querySelector('.listPage').appendChild(newPage);
    };
    if (thisPage != count) {
      let next = document.createElement('li');
      next.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
      next.addEventListener('click', function () {
        changePage(thisPage + 1);
      });
      document.querySelector('.listPage').appendChild(next);
    }
  };
  function changePage(i) {
    thisPage = i;
    loadItem();
  }
};
// Kiểm tra kích thước màn hình khi tải trang
window.onload = function() {
  checkWidth();
};
// Kiểm tra kích thước màn hình khi thay đổi kích thước
window.onresize = function() {
  checkWidth();
};
function checkWidth() {
  var screenWidth = window.innerWidth;
  if (screenWidth < 820) {
    closeNav(); // Gọi hàm closeNav nếu kích thước nhỏ hơn 820px
  } else {
    openNav(); // Gọi hàm openNav nếu kích thước lớn hơn hoặc bằng 820px
  }
}
function openNav() {
  document.getElementById("search-by-filter").style.width = "100%";
}
function closeNav() {
  document.getElementById("search-by-filter").style.width = "0";
}