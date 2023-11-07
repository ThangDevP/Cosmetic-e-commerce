function loadPage(slug) {

    const bodyElement = document.getElementById('body');
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    // Load header and footer (which remain the same)
    fetch('/header/header.html')
        .then(response => response.text())
        .then(data => {
            headerElement.innerHTML = data;
        });
    fetch('/footer/footer.html')
        .then(response => response.text())
        .then(data => {
            footerElement.innerHTML = data;
        });
    // Load dynamic content based on the slug
        // fetch('/api/history')
        //     .then(response => response.json())
        //     .then(data => {
        //         const historyElement = document.createElement('div');
        //         historyElement.classList.add('history-container');

        //         data.history.forEach(item => {
        //             const historyItemElement = document.createElement('div');
        //             historyItemElement.classList.add('history-item');
        //             historyItemElement.innerHTML = `
        //                 <p>Purchase Date: ${item.purchaseDate}</p>
        //                 <p>Purchase Details: ${item.purchaseDetails}</p>
        //                 <p>Purchase Amount: ${item.purchaseAmount}</p>
        //             `;
        //             historyElement.appendChild(historyItemElement);
        //         });

        //         bodyElement.innerHTML = '';
        //         bodyElement.appendChild(historyElement);
        //     })
        //     .catch(() => {
        //         bodyElement.innerHTML = 'No purchase history found.';
        //     });


function plusSlides(n) {
    showSlides((slideIndex += n));
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");

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

fetch(`/home.html`)
    .then((response) => response.text())
    .then((data) => {
        bodyElement.innerHTML = data;
        let slideIndex = 1;

        showSlides(slideIndex);
    })
    .catch(() => {
        bodyElement.innerHTML = "Page not found";
    });
}
// Function to handle routing based on the URL path
function handleRouting() {
    const path = window.location.pathname;
    const slug = path.replace("/", "");
    // Load the appropriate content based on the slug
    loadPage(slug || "home");
}
// Listen for changes in the URL (page navigation)
window.addEventListener("popstate", handleRouting);
// Initial page load
handleRouting();