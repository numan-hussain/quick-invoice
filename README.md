# 📄 Simple Invoice Maker

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://numanhussain.com)
[![Built with HTML](https://img.shields.io/badge/Built%20with-HTML%2FCSS%2FJS-blue.svg)](#)
[![Free for Commercial Use](https://img.shields.io/badge/License-Free%20for%20Commercial%20Use-green.svg)](#)

> Create professional invoices in minutes with this free, easy-to-use invoice generator designed for small businesses and freelancers.

**🔗 Live Demo**: [View Demo](https://numan-hussain.github.io/simple-invoice-maker)

![Invoice Maker Preview](https://via.placeholder.com/800x400/3498db/ffffff?text=Simple+Invoice+Maker+Preview)

## ✨ Features

### 🎨 **Multiple Design Templates**
- **Modern**: Sleek gradient design with contemporary styling
- **Classic**: Traditional professional layout with elegant borders
- **Minimal**: Clean, minimalist design for modern businesses

### 🖼️ **Logo Upload & Branding**
- Upload your company logo with drag & drop interface
- Real-time logo preview in invoices
- Support for all common image formats (PNG, JPG, GIF, etc.)
- Easy logo removal and replacement

### 💾 **Auto-Save & Data Persistence**
- Automatic data saving as you type
- Local storage keeps your data between sessions
- Never lose your work - everything saves automatically
- Smart clear function with data confirmation

### 💼 **Professional Invoice Creation**
- Complete company and client information forms
- Dynamic item management (add/remove items easily)
- Real-time calculations for subtotals, taxes, and discounts
- Multiple currency support (USD, EUR, GBP, CAD, AUD)
- Professional invoice preview with print functionality

### 📱 **Mobile-First Design**
- Fully responsive design works on all devices
- Touch-friendly interface for mobile users
- Optimized layouts for tablets and smartphones
- Progressive web app capabilities

## 🚀 Quick Start

### Option 1: Direct Use
1. Download or clone this repository
2. Open `index.html` in your web browser
3. Start creating professional invoices immediately!

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/numan-hussain/simple-invoice-maker.git

# Navigate to project directory
cd simple-invoice-maker

# Open in your preferred code editor
code .

# Serve locally (optional)
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

## 📖 How to Use

### 1. **Choose Your Design Template**
Select from three professional templates that best match your brand:
- Modern, Classic, or Minimal designs

### 2. **Add Your Branding**
- Upload your company logo
- Fill in your business information
- Customize with your brand colors

### 3. **Enter Invoice Details**
- Set invoice number and dates
- Choose your preferred currency
- Add client information

### 4. **Add Invoice Items**
- Click "Add Item" to include products/services
- Enter descriptions, quantities, and rates
- Automatic calculations for totals

### 5. **Apply Taxes & Discounts**
- Set tax percentage (automatically calculated)
- Apply discounts if needed
- View real-time total updates

### 6. **Preview & Download**
- Click "Preview" to see your formatted invoice
- Use "Print" to save as PDF through your browser
- All data saves automatically for future use

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: No dependencies, pure ES6+
- **Font Awesome 5.15.4**: Professional icons
- **Local Storage API**: Client-side data persistence

### Browser Support
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Key Features
```javascript
// Auto-save functionality
localStorage.setItem('invoiceMakerData', JSON.stringify(data));

// Real-time calculations
const total = subtotal - discountAmount + taxAmount;

// Responsive design
@media (max-width: 768px) { /* Mobile styles */ }
```

## 📁 Project Structure

```
simple-invoice-maker/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Core JavaScript functionality
│   └── scss/
│       └── style.scss      # SCSS source (if using Sass)
├── README.md               # Project documentation
└── LICENSE                 # License file
```

## 🎯 Use Cases

### Perfect For:
- **Freelancers**: Quick invoice creation for client billing
- **Small Businesses**: Professional invoicing without expensive software
- **Consultants**: Time-based billing with detailed line items
- **Service Providers**: Custom invoices with branding
- **Contractors**: Project-based billing solutions

### Industries:
- Graphic Design & Creative Services
- Web Development & IT Services
- Consulting & Professional Services
- Photography & Media Production
- Home Services & Repairs

## 🔧 Customization

### Adding New Currencies
```javascript
// In assets/js/main.js
this.currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'INR': '₹',  // Add new currency
    // ... other currencies
};
```

### Creating Custom Templates
1. Add new template option in HTML
2. Create corresponding CSS classes
3. Update JavaScript template selection logic

### Styling Modifications
Edit `assets/css/style.css` to customize:
- Colors and branding
- Typography and fonts
- Layout and spacing
- Button styles and animations

## 📝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Ideas
- Additional currency support
- New invoice templates
- Enhanced PDF export functionality
- Internationalization (i18n)
- Performance optimizations

## 📄 License

This project is free for commercial and personal use. No attribution required, but always appreciated!

## 👨‍💻 Developer

**Numan Hussain**
- 🌐 Portfolio: [numanhussain.com](https://numanhussain.com)
- 💼 GitHub: [@numan-hussain](https://github.com/numan-hussain)

---

### ⭐ If this project helped you, please consider giving it a star!

Made with ❤️ for the community in 2022
