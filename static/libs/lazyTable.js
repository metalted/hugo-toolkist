(function(window, document) {
    'use strict';

    let rowsPerPage = 20;
    let currentStartIndex = 0;
    let data = [];
    let headers = [];
    let container = null;

    function updateTable(startIndex) {
        const endIndex = Math.min(startIndex + rowsPerPage, data.length);
        const tableBody = container.querySelector('tbody');

        // Clear the current table rows
        tableBody.innerHTML = '';

        // Append new rows
        data.slice(startIndex, endIndex).forEach(row => {
            const rowElement = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = row[header] || '';
                rowElement.appendChild(cell);
            });
            tableBody.appendChild(rowElement);
        });
    }

    function onScroll() {
        const tbody = container.querySelector('tbody');
        const { scrollTop, scrollHeight, clientHeight } = tbody;

        // Determine the current scroll direction
        if (scrollTop + clientHeight >= scrollHeight - 5 && currentStartIndex + rowsPerPage < data.length) {
            // Scrolling down, load more data
            currentStartIndex += rowsPerPage;
            updateTable(currentStartIndex);
        } else if (scrollTop === 0 && currentStartIndex > 0) {
            // Scrolling up, load previous data
            currentStartIndex = Math.max(0, currentStartIndex - rowsPerPage);
            updateTable(currentStartIndex);
        }
    }

    function initializeLazyTable(containerId, tableHeaders, rowData, rowsPerPageOption = 20) {
        container = document.getElementById(containerId);
        headers = tableHeaders;
        data = rowData;
        rowsPerPage = rowsPerPageOption;
        currentStartIndex = 0;

        // Clear any previous table setup
        container.innerHTML = `
            <table style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
                </thead>
                <tbody style="display: block; height: 400px; overflow-y: auto;">
                    <!-- Rows will be dynamically inserted here -->
                </tbody>
            </table>
        `;

        // Attach the scroll event listener
        const tbody = container.querySelector('tbody');
        tbody.removeEventListener('scroll', onScroll); // Remove previous listener if any
        tbody.addEventListener('scroll', onScroll);

        // Initial load
        updateTable(currentStartIndex);
    }

    window.initializeLazyTable = initializeLazyTable;
})(window, document);
