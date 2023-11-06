document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/history") // Fetch the purchase history data
        .then((response) => response.json())
        .then((historyData) => {
            const historyTable = document.getElementById("history-table");

            historyData.forEach((purchase) => {
                const row = historyTable.insertRow();
                const dateCell = row.insertCell(0);
                const detailsCell = row.insertCell(1);
                const amountCell = row.insertCell(2);

                dateCell.textContent = purchase.purchaseDate;
                detailsCell.textContent = purchase.purchaseDetails;
                amountCell.textContent = `$${purchase.purchaseAmount}`;
            });
        })
        .catch((error) => {
            console.error("Error fetching purchase history: ", error);
        });
});
