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
    fetch(`/${slug}.html`)
        .then(response => response.text())
        .then(data => {
            bodyElement.innerHTML = data;
        })
        .catch(() => {
            bodyElement.innerHTML = 'Page not found';
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
