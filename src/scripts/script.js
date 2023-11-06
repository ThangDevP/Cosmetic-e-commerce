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
    if (slug === 'history') {
        fetch('/api/history')
            .then(response => response.json())
            .then(data => {
                const historyElement = document.createElement('div');
                historyElement.classList.add('history-container');

                data.history.forEach(item => {
                    const historyItemElement = document.createElement('div');
                    historyItemElement.classList.add('history-item');
                    historyItemElement.innerHTML = `
                        <p>Purchase Date: ${item.purchaseDate}</p>
                        <p>Purchase Details: ${item.purchaseDetails}</p>
                        <p>Purchase Amount: ${item.purchaseAmount}</p>
                    `;
                    historyElement.appendChild(historyItemElement);
                });

                bodyElement.innerHTML = '';
                bodyElement.appendChild(historyElement);
            })
            .catch(() => {
                bodyElement.innerHTML = 'No purchase history found.';
            });
    } else {
        fetch(`/${slug}.html`)
            .then(response => response.text())
            .then(data => {
                bodyElement.innerHTML = data;
            })
            .catch(() => {
                bodyElement.innerHTML = 'Page not found';
            });
    }
}
