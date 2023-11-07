const brandContainer = document.querySelector('.brands--container');

async function fetchBrands() {
    try {
        const response = await fetch('http://localhost:3000/api/brands');
        if (!response.ok) {
            throw new Error('Lỗi khi tải dữ liệu');
        }
        const brandsData = await response.json();
        displayBrands(brandsData);
    } catch (error) {
        console.error(error);
    }
}

function displayBrands(brands) {
    const brandRow = document.querySelector('.brand--row');
    brands.forEach(brand => {
        const brandItem = document.createElement('div');
        brandItem.classList.add('col-4', 'brands--items');
        brandItem.innerHTML = `
            <img src="${brand.img}" alt="${brand.name}">
            <h3>${brand.name}</h3>
            <p>${brand.description}</p>
        `;
        brandRow.appendChild(brandItem);
    });
}
fetchBrands();





let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
    }

function showSlides(n) {

    let i;
    let slides = document.getElementsByClassName("mySlides");
    console.log(slides)

    if (n > slides.length) {
        slideIndex = 1
    }

    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex - 1].style.display = "block";  
}


