document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const invoiceForm = document.getElementById('invoice-form');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemsTableBody = document.querySelector('#items-table tbody');
    const subtotalInput = document.getElementById('subtotal');
    const taxRateInput = document.getElementById('tax-rate');
    const grandTotalInput = document.getElementById('grand-total');

    // --- Initial Setup ---
    function initializeFirstRow() {
        const firstRow = itemsTableBody.querySelector('tr');
        if (firstRow) {
            attachItemRowEventListeners(firstRow);
        }
    }
    initializeFirstRow();
    updateTotals(); // Initial calculation

    // --- Event Listeners ---
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addItemRow);
    }

    if (invoiceForm) {
        invoiceForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission
            if (validateForm()) {
                generateInvoice();
            } else {
                alert("Please fill in all required fields.");
            }
        });
    }

    if (taxRateInput) {
        taxRateInput.addEventListener('input', updateTotals);
    }

    // Event delegation for dynamically added item rows (inputs and remove buttons)
    if (itemsTableBody) {
        itemsTableBody.addEventListener('input', (event) => {
            const target = event.target;
            const row = target.closest('tr');
            if (!row) return;

            if (target.classList.contains('item-quantity') || target.classList.contains('item-unit-price')) {
                updateLineTotal(row);
            }
        });

        itemsTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item-btn')) {
                removeItemRow(event);
            }
        });
    }

    // --- Functions ---

    /**
     * Attaches necessary event listeners to input fields of an item row.
     * @param {HTMLTableRowElement} row - The table row element.
     */
    function attachItemRowEventListeners(row) {
        const quantityInput = row.querySelector('.item-quantity');
        const unitPriceInput = row.querySelector('.item-unit-price');

        // Event listeners for these are now handled by event delegation in itemsTableBody
        // This function can be used for any specific initialization if needed in the future
        // For now, ensuring the inputs are correctly processed by updateLineTotal is key.
    }

    /**
     * Adds a new item row to the items table.
     */
    function addItemRow() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" class="item-description" name="item-description[]" required></td>
            <td><input type="number" class="item-quantity" name="item-quantity[]" value="1" min="1" step="1" required></td>
            <td><input type="number" class="item-unit-price" name="item-unit-price[]" value="0.00" step="0.01" min="0" required></td>
            <td><span class="line-total">0.00</span></td>
            <td><button type="button" class="remove-item-btn">Remove</button></td>
        `;
        itemsTableBody.appendChild(newRow);
        // attachItemRowEventListeners(newRow); // Not strictly needed due to event delegation
        updateTotals(); // Recalculate totals as a new row is added
    }

    /**
     * Removes the item row associated with the button that triggered the event.
     * @param {Event} event - The click event from the remove button.
     */
    function removeItemRow(event) {
        const rowToRemove = event.target.closest('tr');
        if (rowToRemove) {
            if (itemsTableBody.querySelectorAll('tr').length > 1) {
                rowToRemove.remove();
            } else {
                // Clear the values if it's the last row
                rowToRemove.querySelector('.item-description').value = '';
                rowToRemove.querySelector('.item-quantity').value = '1';
                rowToRemove.querySelector('.item-unit-price').value = '0.00';
                updateLineTotal(rowToRemove); // This will update line total and overall totals
                // alert("At least one item must remain. Values have been cleared.");
            }
            updateTotals();
        }
    }

    /**
     * Updates the line total for a given item row.
     * @param {HTMLTableRowElement} itemRow - The table row element.
     */
    function updateLineTotal(itemRow) {
        const quantityInput = itemRow.querySelector('.item-quantity');
        const unitPriceInput = itemRow.querySelector('.item-unit-price');
        const lineTotalSpan = itemRow.querySelector('.line-total');

        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;

        // Ensure quantity is a positive integer
        if (quantity < 0 ) {
            quantityInput.value = Math.abs(Math.round(quantity) || 1);
        } else if (!Number.isInteger(quantity)) {
             quantityInput.value = Math.round(quantity || 1);
        }


        const lineTotal = (parseFloat(quantityInput.value) || 0) * unitPrice;
        lineTotalSpan.textContent = lineTotal.toFixed(2);

        updateTotals();
    }

    /**
     * Calculates and updates the subtotal, tax, and grand total.
     */
    function updateTotals() {
        let subtotal = 0;
        itemsTableBody.querySelectorAll('tr').forEach(row => {
            const lineTotalSpan = row.querySelector('.line-total');
            if (lineTotalSpan) {
                subtotal += parseFloat(lineTotalSpan.textContent) || 0;
            }
        });

        const taxRate = parseFloat(taxRateInput.value) || 0;
        if (taxRate < 0) {
            taxRateInput.value = 0;
        }
        const currentTaxRate = parseFloat(taxRateInput.value) || 0;


        const taxAmount = subtotal * (currentTaxRate / 100);
        const grandTotal = subtotal + taxAmount;

        if (subtotalInput) subtotalInput.value = subtotal.toFixed(2);
        if (grandTotalInput) grandTotalInput.value = grandTotal.toFixed(2);
    }
    
    /**
     * Validates the form to ensure all required fields are filled.
     * @returns {boolean} True if the form is valid, false otherwise.
     */
    function validateForm() {
        let isValid = true;
        // Check required fields in sender, recipient, and invoice meta sections
        const requiredInputs = invoiceForm.querySelectorAll('input[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid-input'); // Optional: add a class for styling
            } else {
                input.classList.remove('invalid-input');
            }
        });

        // Check item descriptions
        itemsTableBody.querySelectorAll('.item-description').forEach(descInput => {
            if (!descInput.value.trim()) {
                // If there's only one empty item row, it's fine, unless other item data is present
                const row = descInput.closest('tr');
                const qty = row.querySelector('.item-quantity').value;
                const price = row.querySelector('.item-unit-price').value;
                // An item is considered "active" if it has quantity or price > 0, or if it's not the only row
                const isActiveItem = (parseFloat(qty) > 0 || parseFloat(price) > 0) || itemsTableBody.querySelectorAll('tr').length > 1;

                if(isActiveItem) {
                    isValid = false;
                    descInput.classList.add('invalid-input');
                } else {
                     descInput.classList.remove('invalid-input');
                }
            } else {
                descInput.classList.remove('invalid-input');
            }
        });
        return isValid;
    }


    /**
     * Collects all invoice data and logs it to the console.
     */
    function generateInvoice() {
        const invoiceData = {
            senderDetails: {
                name: document.getElementById('sender-name').value,
                address: document.getElementById('sender-address').value,
                email: document.getElementById('sender-email').value,
                phone: document.getElementById('sender-phone').value,
            },
            recipientDetails: {
                name: document.getElementById('recipient-name').value,
                address: document.getElementById('recipient-address').value,
                email: document.getElementById('recipient-email').value,
                phone: document.getElementById('recipient-phone').value,
            },
            invoiceMeta: {
                invoiceNumber: document.getElementById('invoice-number').value,
                invoiceDate: document.getElementById('invoice-date').value,
                dueDate: document.getElementById('due-date').value,
            },
            items: [],
            summary: {
                subtotal: subtotalInput.value,
                taxRate: taxRateInput.value,
                // taxAmount: (parseFloat(subtotalInput.value) * (parseFloat(taxRateInput.value) / 100)).toFixed(2), // Calculate for logging
                grandTotal: grandTotalInput.value,
            }
        };

        itemsTableBody.querySelectorAll('tr').forEach(row => {
            const descriptionInput = row.querySelector('.item-description');
            const quantityInput = row.querySelector('.item-quantity');
            const unitPriceInput = row.querySelector('.item-unit-price');
            const lineTotalSpan = row.querySelector('.line-total');

            // Only include items that have a description
            if (descriptionInput && descriptionInput.value.trim() !== "") {
                invoiceData.items.push({
                    description: descriptionInput.value,
                    quantity: quantityInput.value,
                    unitPrice: unitPriceInput.value,
                    lineTotal: lineTotalSpan.textContent
                });
            }
        });

        console.log("Invoice Data:", JSON.stringify(invoiceData, null, 2));
        alert("Invoice data collected! Check the browser console (F12 -> Console) for the JSON data.");
        // Future: Send data to server, generate PDF, etc.
    }
});
