class InvoiceMaker {
    constructor() {
        this.items = [];
        this.currentTemplate = 'classic';
        this.companyLogo = null;
        this.currencySymbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'CAD': '$',
            'AUD': '$'
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFromLocalStorage();
        this.setDefaultValues();
        if (document.getElementById('itemsList').children.length === 0) {
            this.addInitialItem();
        }
    }

    bindEvents() {
        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const template = e.currentTarget.dataset.template;
                this.selectTemplate(template);
            });
        });

        // Logo upload
        document.getElementById('companyLogo').addEventListener('change', (e) => this.handleLogoUpload(e));
        document.getElementById('logoPreview').addEventListener('click', () => {
            document.getElementById('companyLogo').click();
        });
        document.getElementById('removeLogo').addEventListener('click', () => this.removeLogo());

        // Add item button
        document.getElementById('addItemBtn').addEventListener('click', () => this.addItem());

        // Calculate totals on input changes
        document.getElementById('taxRate').addEventListener('input', () => this.calculateTotals());
        document.getElementById('discountRate').addEventListener('input', () => this.calculateTotals());

        // Action buttons
        document.getElementById('previewBtn').addEventListener('click', () => this.showPreview());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPDF());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAll());

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.hidePreview());
        document.getElementById('printBtn').addEventListener('click', () => this.printInvoice());
        document.getElementById('downloadFromModal').addEventListener('click', () => this.downloadPDF());

        // Close modal when clicking outside
        document.getElementById('previewModal').addEventListener('click', (e) => {
            if (e.target.id === 'previewModal') {
                this.hidePreview();
            }
        });

        // Currency change
        document.getElementById('currency').addEventListener('change', () => this.calculateTotals());

        // Auto-save to localStorage
        this.bindAutoSave();
    }

    bindAutoSave() {
        // Save form data on input changes
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveToLocalStorage();
            });
            input.addEventListener('change', () => {
                this.saveToLocalStorage();
            });
        });
    }

    selectTemplate(template) {
        this.currentTemplate = template;
        
        // Update UI
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-template="${template}"]`).classList.add('active');
        
        this.saveToLocalStorage();
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.companyLogo = e.target.result;
                this.displayLogo();
                this.saveToLocalStorage();
            };
            reader.readAsDataURL(file);
        }
    }

    displayLogo() {
        const logoPreview = document.getElementById('logoPreview');
        const removeBtn = document.getElementById('removeLogo');
        
        if (this.companyLogo) {
            logoPreview.innerHTML = `<img src="${this.companyLogo}" alt="Company Logo">`;
            logoPreview.classList.add('has-image');
            removeBtn.style.display = 'block';
        } else {
            logoPreview.innerHTML = `
                <i class="fas fa-upload"></i>
                <span>Click to upload logo</span>
            `;
            logoPreview.classList.remove('has-image');
            removeBtn.style.display = 'none';
        }
    }

    removeLogo() {
        this.companyLogo = null;
        document.getElementById('companyLogo').value = '';
        this.displayLogo();
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        const data = {
            template: this.currentTemplate,
            logo: this.companyLogo,
            formData: this.getFormData(),
            items: this.getItemsData()
        };
        localStorage.setItem('invoiceMakerData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('invoiceMakerData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Load template
                if (data.template) {
                    this.selectTemplate(data.template);
                }
                
                // Load logo
                if (data.logo) {
                    this.companyLogo = data.logo;
                    this.displayLogo();
                }
                
                // Load form data
                if (data.formData) {
                    this.setFormData(data.formData);
                }
                
                // Load items
                if (data.items && data.items.length > 0) {
                    this.loadItems(data.items);
                }
                
            } catch (error) {
                console.warn('Failed to load saved data:', error);
            }
        }
    }

    getFormData() {
        return {
            companyName: document.getElementById('companyName').value,
            companyAddress: document.getElementById('companyAddress').value,
            companyEmail: document.getElementById('companyEmail').value,
            companyPhone: document.getElementById('companyPhone').value,
            clientName: document.getElementById('clientName').value,
            clientAddress: document.getElementById('clientAddress').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientPhone: document.getElementById('clientPhone').value,
            invoiceNumber: document.getElementById('invoiceNumber').value,
            invoiceDate: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('dueDate').value,
            currency: document.getElementById('currency').value,
            taxRate: document.getElementById('taxRate').value,
            discountRate: document.getElementById('discountRate').value,
            notes: document.getElementById('notes').value
        };
    }

    setFormData(data) {
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element && data[key]) {
                element.value = data[key];
            }
        });
    }

    getItemsData() {
        const itemRows = document.querySelectorAll('.item-row');
        const items = [];
        
        itemRows.forEach(row => {
            const description = row.querySelector('.item-description').value;
            const quantity = row.querySelector('.item-quantity').value;
            const rate = row.querySelector('.item-rate').value;
            
            items.push({ description, quantity, rate });
        });
        
        return items;
    }

    loadItems(items) {
        document.getElementById('itemsList').innerHTML = '';
        items.forEach(item => {
            this.addItem();
            const lastRow = document.querySelector('.item-row:last-child');
            if (lastRow) {
                lastRow.querySelector('.item-description').value = item.description || '';
                lastRow.querySelector('.item-quantity').value = item.quantity || '';
                lastRow.querySelector('.item-rate').value = item.rate || '';
                this.calculateItemAmount(lastRow);
            }
        });
    }

    setDefaultValues() {
        // Set default dates
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 30);

        document.getElementById('invoiceDate').value = today.toISOString().split('T')[0];
        document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

        // Generate invoice number
        const invoiceNumber = '#INV-' + String(Date.now()).slice(-6);
        document.getElementById('invoiceNumber').value = invoiceNumber;
    }

    addItem() {
        const itemId = 'item_' + Date.now();
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.dataset.itemId = itemId;

        itemRow.innerHTML = `
            <input type="text" placeholder="Item description" class="item-description" />
            <input type="number" placeholder="1" min="0" step="0.01" class="item-quantity" value="1" />
            <input type="number" placeholder="0.00" min="0" step="0.01" class="item-rate" />
            <span class="item-amount">$0.00</span>
            <button type="button" class="btn btn-danger" onclick="invoiceMaker.removeItem('${itemId}')">
                <i class="fas fa-trash"></i>
            </button>
        `;

        document.getElementById('itemsList').appendChild(itemRow);

        // Add event listeners for calculations
        const quantityInput = itemRow.querySelector('.item-quantity');
        const rateInput = itemRow.querySelector('.item-rate');
        const descriptionInput = itemRow.querySelector('.item-description');

        quantityInput.addEventListener('input', () => {
            this.calculateItemAmount(itemRow);
            this.saveToLocalStorage();
        });
        rateInput.addEventListener('input', () => {
            this.calculateItemAmount(itemRow);
            this.saveToLocalStorage();
        });
        descriptionInput.addEventListener('input', () => {
            this.saveToLocalStorage();
        });

        this.calculateTotals();
    }

    addInitialItem() {
        this.addItem();
    }

    removeItem(itemId) {
        const itemRow = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemRow) {
            itemRow.remove();
            this.calculateTotals();
        }
    }

    calculateItemAmount(itemRow) {
        const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
        const rate = parseFloat(itemRow.querySelector('.item-rate').value) || 0;
        const amount = quantity * rate;
        
        const currencySymbol = this.currencySymbols[document.getElementById('currency').value];
        itemRow.querySelector('.item-amount').textContent = currencySymbol + amount.toFixed(2);
        
        this.calculateTotals();
    }

    calculateTotals() {
        const itemRows = document.querySelectorAll('.item-row');
        let subtotal = 0;

        itemRows.forEach(row => {
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            subtotal += quantity * rate;
        });

        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;

        const discountAmount = subtotal * (discountRate / 100);
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = subtotalAfterDiscount * (taxRate / 100);
        const total = subtotalAfterDiscount + taxAmount;

        const currencySymbol = this.currencySymbols[document.getElementById('currency').value];

        document.getElementById('subtotal').textContent = currencySymbol + subtotal.toFixed(2);
        document.getElementById('taxAmount').textContent = currencySymbol + taxAmount.toFixed(2);
        document.getElementById('discountAmount').textContent = '-' + currencySymbol + discountAmount.toFixed(2);
        document.getElementById('finalTotal').textContent = currencySymbol + total.toFixed(2);
    }

    getInvoiceData() {
        const itemRows = document.querySelectorAll('.item-row');
        const items = [];

        itemRows.forEach(row => {
            const description = row.querySelector('.item-description').value;
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            
            if (description || quantity || rate) {
                items.push({
                    description,
                    quantity,
                    rate,
                    amount: quantity * rate
                });
            }
        });

        const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
        const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
        const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;
        
        const discountAmount = subtotal * (discountRate / 100);
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = subtotalAfterDiscount * (taxRate / 100);
        const total = subtotalAfterDiscount + taxAmount;

        return {
            company: {
                name: document.getElementById('companyName').value,
                address: document.getElementById('companyAddress').value,
                email: document.getElementById('companyEmail').value,
                phone: document.getElementById('companyPhone').value
            },
            client: {
                name: document.getElementById('clientName').value,
                address: document.getElementById('clientAddress').value,
                email: document.getElementById('clientEmail').value,
                phone: document.getElementById('clientPhone').value
            },
            invoice: {
                number: document.getElementById('invoiceNumber').value,
                date: document.getElementById('invoiceDate').value,
                dueDate: document.getElementById('dueDate').value,
                currency: document.getElementById('currency').value
            },
            items,
            totals: {
                subtotal,
                taxRate,
                taxAmount,
                discountRate,
                discountAmount,
                total
            },
            notes: document.getElementById('notes').value
        };
    }

    showPreview() {
        const data = this.getInvoiceData();
        const currencySymbol = this.currencySymbols[data.invoice.currency];
        
        const logoHtml = this.companyLogo ? 
            `<img src="${this.companyLogo}" alt="Company Logo" class="preview-company-logo">` : '';
        
        const previewHTML = `
            <div class="preview-header">
                <div class="preview-company">
                    ${logoHtml}
                    <h2>${data.company.name || 'Your Company'}</h2>
                    <p>${data.company.address || ''}</p>
                    <p>${data.company.email || ''}</p>
                    <p>${data.company.phone || ''}</p>
                </div>
                <div class="preview-invoice-details">
                    <div class="preview-invoice-title">INVOICE</div>
                    <p><strong>Invoice #:</strong> ${data.invoice.number}</p>
                    <p><strong>Date:</strong> ${this.formatDate(data.invoice.date)}</p>
                    <p><strong>Due Date:</strong> ${this.formatDate(data.invoice.dueDate)}</p>
                </div>
            </div>

            <div class="preview-section">
                <h3>Bill To:</h3>
                <p><strong>${data.client.name || 'Client Name'}</strong></p>
                <p>${data.client.address || ''}</p>
                <p>${data.client.email || ''}</p>
                <p>${data.client.phone || ''}</p>
            </div>

            <table class="preview-items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.length > 0 ? data.items.map(item => `
                        <tr>
                            <td>${item.description || 'No description'}</td>
                            <td>${item.quantity}</td>
                            <td>${currencySymbol}${item.rate.toFixed(2)}</td>
                            <td class="amount">${currencySymbol}${item.amount.toFixed(2)}</td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="4" style="text-align: center; padding: 20px; color: #666;">No items added yet</td>
                        </tr>
                    `}
                </tbody>
            </table>

            <div class="preview-totals">
                <div class="preview-total-row">
                    <span>Subtotal:</span>
                    <span>${currencySymbol}${data.totals.subtotal.toFixed(2)}</span>
                </div>
                ${data.totals.discountRate > 0 ? `
                    <div class="preview-total-row">
                        <span>Discount (${data.totals.discountRate}%):</span>
                        <span>-${currencySymbol}${data.totals.discountAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                ${data.totals.taxRate > 0 ? `
                    <div class="preview-total-row">
                        <span>Tax (${data.totals.taxRate}%):</span>
                        <span>${currencySymbol}${data.totals.taxAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="preview-total-row preview-final-total">
                    <span>Total:</span>
                    <span>${currencySymbol}${data.totals.total.toFixed(2)}</span>
                </div>
            </div>

            ${data.notes ? `
                <div class="preview-section">
                    <h3>Notes:</h3>
                    <p>${data.notes}</p>
                </div>
            ` : ''}
        `;

        const invoicePreview = document.getElementById('invoicePreview');
        invoicePreview.innerHTML = previewHTML;
        
        // Apply template class
        invoicePreview.className = `invoice-preview ${this.currentTemplate}-template`;
        
        // Show the modal
        const modal = document.getElementById('previewModal');
        modal.style.display = 'block';
        
        // Force a reflow to ensure content is rendered
        invoicePreview.offsetHeight;
        
        // Ensure all content is visible (fix for white screen)
        setTimeout(() => {
            const elements = invoicePreview.querySelectorAll('*');
            elements.forEach(el => {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
        }, 100);
    }

    hidePreview() {
        document.getElementById('previewModal').style.display = 'none';
    }

    printInvoice() {
        // Create a new window with just the invoice content
        const modal = document.getElementById('previewModal');
        const preview = document.getElementById('invoicePreview');
        
        if (!modal.style.display || modal.style.display === 'none') {
            this.showPreview();
            setTimeout(() => this.printInvoice(), 300);
            return;
        }
        
        // Get the invoice HTML content
        const invoiceHTML = preview.innerHTML;
        const data = this.getInvoiceData();
        const invoiceNumber = data.invoice.number || 'INV-001';
        
        // Create a new window
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        // Write the complete HTML document to the new window
        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoiceNumber}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 30px;
            background: white;
            color: #000;
            font-size: 12pt;
            line-height: 1.4;
        }
        
        .preview-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
            page-break-inside: avoid;
        }
        
        .preview-company {
            flex: 1;
            margin-right: 20px;
        }
        
        .preview-company h2 {
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 8px 0;
            color: #000;
            line-height: 1.2;
        }
        
        .preview-company p {
            margin: 2px 0;
            color: #000;
            font-size: 10pt;
            line-height: 1.3;
        }
        
        .preview-company-logo {
            max-width: 100px;
            max-height: 60px;
            object-fit: contain;
            margin-bottom: 10px;
            display: block;
        }
        
        .preview-invoice-details {
            text-align: right;
            flex: 1;
            max-width: 300px;
        }
        
        .preview-invoice-title {
            font-size: 24pt;
            color: #000;
            font-weight: bold;
            margin-bottom: 10px;
            border: 2px solid #000;
            padding: 8px 15px;
            display: inline-block;
            letter-spacing: 1px;
            background: white;
        }
        
        .preview-invoice-details p {
            margin: 3px 0;
            color: #000;
            font-size: 10pt;
            line-height: 1.3;
        }
        
        .preview-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .preview-section h3 {
            color: #000;
            margin-bottom: 8px;
            font-size: 12pt;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }
        
        .preview-section p {
            margin: 2px 0;
            color: #000;
            font-size: 10pt;
            line-height: 1.3;
        }
        
        .preview-items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border: 1px solid #000;
        }
        
        .preview-items-table th {
            background: #000;
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-weight: bold;
            font-size: 10pt;
            border: 1px solid #000;
        }
        
        .preview-items-table td {
            padding: 6px;
            border: 1px solid #000;
            font-size: 10pt;
            color: #000;
            vertical-align: top;
        }
        
        .preview-items-table .amount {
            text-align: right;
            font-weight: bold;
        }
        
        .preview-items-table tbody tr:nth-child(even) td {
            background: #f5f5f5;
        }
        
        .preview-totals {
            margin-top: 20px;
            margin-left: auto;
            width: 300px;
            border: 1px solid #000;
            padding: 15px;
            background: #f8f8f8;
            page-break-inside: avoid;
        }
        
        .preview-total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px 0;
            font-size: 10pt;
            color: #000;
        }
        
        .preview-final-total {
            border-top: 2px solid #000;
            padding-top: 6px;
            margin-top: 8px;
            font-weight: bold;
            font-size: 12pt;
        }
        
        @media print {
            body { margin: 0.5in; }
            @page { size: A4; margin: 0.5in; }
        }
    </style>
</head>
<body>
    ${invoiceHTML}
</body>
</html>
        `);
        
        printWindow.document.close();
        
        // Wait for content to load, then print
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            
            // Close the window after printing (optional)
            setTimeout(() => {
                printWindow.close();
            }, 100);
        }, 500);
    }

    async downloadPDF() {
        try {
            // Show the preview first
            this.showPreview();
            
            // Wait for content to render
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const preview = document.getElementById('invoicePreview');
            const data = this.getInvoiceData();
            
            // Try to use jsPDF if available for direct PDF generation
            if (typeof window.jsPDF !== 'undefined') {
                const { jsPDF } = window.jsPDF;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                // Use html2canvas to convert the content to image, then add to PDF
                if (typeof html2canvas !== 'undefined') {
                    try {
                        // Temporarily show the preview content in a clean state
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = preview.innerHTML;
                        tempDiv.style.cssText = `
                            position: absolute;
                            top: -9999px;
                            left: -9999px;
                            width: 800px;
                            background: white;
                            color: black;
                            font-family: 'Times New Roman', serif;
                            font-size: 14px;
                            line-height: 1.4;
                            padding: 20px;
                        `;
                        
                        // Add specific styles for PDF generation
                        const style = document.createElement('style');
                        style.textContent = `
                            .preview-header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid black; padding-bottom: 10px; }
                            .preview-company h2 { font-size: 18px; margin: 0 0 5px 0; font-weight: bold; }
                            .preview-company p { margin: 2px 0; font-size: 12px; }
                            .preview-invoice-details { text-align: right; }
                            .preview-invoice-title { font-size: 20px; font-weight: bold; border: 2px solid black; padding: 5px 10px; display: inline-block; }
                            .preview-items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                            .preview-items-table th { background: black; color: white; padding: 8px; border: 1px solid black; }
                            .preview-items-table td { padding: 6px; border: 1px solid black; }
                            .preview-totals { margin-top: 20px; width: 300px; margin-left: auto; border: 1px solid black; padding: 10px; }
                            .preview-total-row { display: flex; justify-content: space-between; margin: 5px 0; }
                            .preview-final-total { border-top: 2px solid black; padding-top: 5px; margin-top: 5px; font-weight: bold; }
                        `;
                        tempDiv.appendChild(style);
                        document.body.appendChild(tempDiv);
                        
                        const canvas = await html2canvas(tempDiv, {
                            backgroundColor: '#ffffff',
                            scale: 2,
                            useCORS: true,
                            allowTaint: true
                        });
                        
                        document.body.removeChild(tempDiv);
                        
                        const imgData = canvas.toDataURL('image/png');
                        const imgWidth = 190; // A4 width minus margins
                        const pageHeight = 297; // A4 height
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        
                        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                        
                        // Generate filename with invoice number and date
                        const invoiceNumber = data.invoice.number || 'INV-001';
                        const invoiceDate = data.invoice.date ? new Date(data.invoice.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                        const cleanInvoiceNumber = invoiceNumber.replace(/[^\w\-]/g, '');
                        const filename = `Invoice-${cleanInvoiceNumber}-${invoiceDate}.pdf`;
                        
                        pdf.save(filename);
                        return;
                        
                    } catch (error) {
                        console.error('PDF generation error:', error);
                    }
                }
                
                // Fallback: Simple text-based PDF
                const invoiceNumber = data.invoice.number || 'INV-001';
                const invoiceDate = data.invoice.date ? new Date(data.invoice.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                const cleanInvoiceNumber = invoiceNumber.replace(/[^\w\-]/g, '');
                const filename = `Invoice-${cleanInvoiceNumber}-${invoiceDate}.pdf`;
                
                // Add content to PDF
                pdf.setFontSize(20);
                pdf.text('INVOICE', 105, 20, { align: 'center' });
                
                pdf.setFontSize(12);
                let yPos = 40;
                
                // Company info
                pdf.text(`Company: ${data.company.name || 'N/A'}`, 20, yPos);
                yPos += 7;
                if (data.company.address) {
                    pdf.text(`Address: ${data.company.address}`, 20, yPos);
                    yPos += 7;
                }
                if (data.company.email) {
                    pdf.text(`Email: ${data.company.email}`, 20, yPos);
                    yPos += 7;
                }
                
                yPos += 10;
                
                // Invoice details
                pdf.text(`Invoice #: ${data.invoice.number}`, 120, 40);
                pdf.text(`Date: ${this.formatDate(data.invoice.date)}`, 120, 47);
                pdf.text(`Due: ${this.formatDate(data.invoice.dueDate)}`, 120, 54);
                
                // Client info
                pdf.text(`Bill To: ${data.client.name || 'N/A'}`, 20, yPos);
                yPos += 7;
                if (data.client.address) {
                    pdf.text(data.client.address, 20, yPos);
                    yPos += 7;
                }
                
                yPos += 15;
                
                // Items
                pdf.text('Description', 20, yPos);
                pdf.text('Qty', 120, yPos);
                pdf.text('Rate', 140, yPos);
                pdf.text('Amount', 170, yPos);
                yPos += 7;
                
                pdf.line(20, yPos, 190, yPos); // Header line
                yPos += 5;
                
                const currencySymbol = this.currencySymbols[data.invoice.currency];
                data.items.forEach(item => {
                    pdf.text(item.description || 'Item', 20, yPos);
                    pdf.text(item.quantity.toString(), 120, yPos);
                    pdf.text(`${currencySymbol}${item.rate.toFixed(2)}`, 140, yPos);
                    pdf.text(`${currencySymbol}${item.amount.toFixed(2)}`, 170, yPos);
                    yPos += 7;
                });
                
                yPos += 10;
                pdf.text(`Total: ${currencySymbol}${data.totals.total.toFixed(2)}`, 170, yPos);
                
                pdf.save(filename);
                return;
            }
            
            // Fallback to print window if jsPDF is not available
            this.printInvoice();
            
        } catch (error) {
            console.error('Download error:', error);
            alert('Unable to generate PDF directly. Opening print window instead.');
            this.printInvoice();
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all data? This will also clear the saved data from your browser.')) {
            // Clear localStorage
            localStorage.removeItem('invoiceMakerData');
            
            // Clear all form fields
            document.querySelectorAll('input, textarea, select').forEach(field => {
                if (field.type === 'date') {
                    return; // Keep default dates
                }
                if (field.id === 'currency') {
                    field.value = 'USD'; // Reset to default currency
                    return;
                }
                field.value = '';
            });

            // Clear logo
            this.companyLogo = null;
            this.displayLogo();

            // Reset template to classic
            this.selectTemplate('classic');

            // Clear items list
            document.getElementById('itemsList').innerHTML = '';

            // Reset to defaults
            this.setDefaultValues();
            this.addInitialItem();
            this.calculateTotals();
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize the invoice maker when the page loads
let invoiceMaker;
document.addEventListener('DOMContentLoaded', () => {
    invoiceMaker = new InvoiceMaker();
});

// Export for global access (needed for inline event handlers)
window.invoiceMaker = invoiceMaker;