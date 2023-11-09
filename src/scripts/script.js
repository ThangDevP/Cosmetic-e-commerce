function loadPage(slug) {
  const bodyElement = document.getElementById("body");
  const headerElement = document.getElementById("header");
  const footerElement = document.getElementById("footer");
  // Load header and footer (which remain the same)
  fetch("/header/header.html")
    .then((response) => response.text())
    .then((data) => {
      headerElement.innerHTML = data;
    });
  fetch("/footer/footer.html")
    .then((response) => response.text())
    .then((data) => {
      footerElement.innerHTML = data;
    });
  fetch(`/${slug}.html`)
    .then((response) => response.text())
    .then((data) => {
      bodyElement.innerHTML = data;
    })
    .catch(() => {
      bodyElement.innerHTML = "Page not found";
    });
}
