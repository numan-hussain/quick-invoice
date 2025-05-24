# Simple Invoice Maker

## Overview

Simple Invoice Maker is a browser-based tool designed to help users easily create and manage invoices. It provides a user-friendly interface to input sender and recipient details, add multiple line items, calculate totals including tax, and generate a summary of the invoice. This project is built using HTML, CSS, and JavaScript.

## Features

-   **Sender and Recipient Information:** Input fields for all necessary contact details for both the sender and the recipient.
-   **Invoice Details:** Specify crucial invoice metadata such as invoice number, issue date, and due date.
-   **Dynamic Item Rows:**
    -   Add multiple items to the invoice.
    -   Each item includes fields for description, quantity, and unit price.
    -   Remove items that are no longer needed.
-   **Automatic Calculations:**
    -   **Line Totals:** Automatically calculated for each item (Quantity × Unit Price).
    -   **Subtotal:** Sum of all line totals.
    -   **Tax Calculation:** Apply a tax rate (percentage) to the subtotal.
    -   **Grand Total:** Automatically calculated (Subtotal + Tax Amount).
-   **Invoice Data Collection:**
    -   The "Generate Invoice" button collects all entered data.
    -   Currently, this data is logged to the browser's developer console (Viewable with F12 -> Console).

## How to Use

1.  **Open the Application:**
    *   Clone or download the project files.
    *   Navigate to the project directory and open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox, Edge).

2.  **Fill out the Invoice Form:**
    *   **Sender Details:** Enter your name/company name, address, email, and phone number.
    *   **Recipient Details:** Enter the client's name/company name, address, email, and phone number.
    *   **Invoice Details:** Provide an Invoice Number, select the Invoice Date, and set the Due Date.
    *   **Add Items:**
        *   For each item you want to include in the invoice, fill in the "Description", "Quantity", and "Unit Price". The "Line Total" will update automatically.
        *   Click the "**Add Item**" button to add more item rows as needed.
        *   Click the "**Remove**" button next to an item to delete it.
    *   **Adjust Tax:** Enter the desired tax rate in the "Tax (%)" field. The Subtotal, Tax Amount (calculated implicitly), and Grand Total will update.
    *   **Generate Invoice:** Once all details are entered, click the "**Generate Invoice**" button.
        *   Currently, this action will collect all the invoice information and display it as a JSON object in your browser's developer console. Press F12 and look at the "Console" tab to see the data.

## Future Improvements

This project serves as a foundation for a more feature-rich invoicing tool. Potential future enhancements include:

-   **PDF Generation:** Directly generate and download invoices as PDF files.
-   **Save/Load Invoices:** Implement functionality to save invoices (e.g., using local storage or a backend) and load them later.
-   **Invoice Templates:** Offer various templates for different invoice styles.
-   **User Accounts & Database:** For more robust storage and management of multiple invoices and clients.
-   **Email Integration:** Option to send invoices directly via email.
-   **Localization and Currency Options:** Support for different languages and currencies.

---

This updated README provides a comprehensive guide for users and developers.
