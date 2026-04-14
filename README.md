# HersStep Online Shop - Prototype

A fully functional e-commerce website prototype for women's footwear, built according to the requirements specification.

## 🚀 Getting Started

### Opening the Prototype

Simply open `index.html` in your web browser to start using the prototype. No server setup required!

```bash
# Option 1: Direct file access
# Open: c:\Users\sithi\OneDrive\Desktop\HersStep\index.html

# Option 2: Using a local server (recommended for full functionality)
# In VS Code, right-click index.html and select "Open with Live Server"
```

## 👤 Test Accounts

### Customer Account
- **Email:** customer@example.com
- **Password:** customer123

### Staff Account
- **Email:** staff@hersstep.com
- **Password:** staff123

### Admin Account
- **Email:** admin@hersstep.com
- **Password:** admin123

## 📁 Project Structure

```
HersStep/
├── index.html                 # Homepage
├── css/
│   ├── styles.css            # Main stylesheet
│   └── auth.css              # Authentication pages styles
├── js/
│   └── app.js                # Main application logic & data
├── pages/
│   ├── signup.html           # Customer registration
│   ├── login.html            # Login page
│   ├── forgot-password.html  # Password reset
│   ├── products.html         # Product catalog with filters
│   ├── cart.html             # Shopping cart
│   ├── checkout.html         # Checkout process
│   ├── order-confirmation.html  # Order confirmation
│   ├── orders.html           # Customer order history
│   ├── order-details.html    # Individual order view
│   ├── profile.html          # Customer profile
│   ├── about.html            # About page
│   ├── staff-dashboard.html  # Staff dashboard
│   ├── staff-products.html   # Product management
│   ├── staff-orders.html     # Order management
│   ├── staff-reports.html    # Sales reports
│   ├── admin-dashboard.html  # Admin dashboard
│   └── admin-staff.html      # Staff account management
├── requirements.md           # Requirements specification
├── agent.md                  # Agent definitions
└── README.md                 # This file
```

## ✅ Implemented Features

### Customer Features (C-01 to C-28)
- ✅ Account registration with email/phone
- ✅ Login/logout functionality
- ✅ Forgot password flow
- ✅ Profile management
- ✅ Product browsing with filters and sorting
- ✅ Shopping cart management
- ✅ Checkout with promo codes
- ✅ Mock payment processing
- ✅ Order history and tracking
- ✅ Order cancellation
- ✅ Return/refund request UI
- ✅ Contact support forms
- ✅ Order notifications

### Staff Features (S-01 to S-19)
- ✅ Staff login
- ✅ Product management (add, edit, delete)
- ✅ Stock level updates
- ✅ Order management
- ✅ Order status updates
- ✅ Customer communication
- ✅ Dashboard with statistics
- ✅ Sales reports generation

### Admin Features (A-01 to A-04)
- ✅ Admin login
- ✅ Create staff accounts
- ✅ Deactivate staff accounts
- ✅ View and edit staff accounts

### UI/UX Features (U-01 to U-04)
- ✅ Responsive design (desktop & mobile)
- ✅ Modern, clean interface
- ✅ Real-time notifications
- ✅ Status updates reflect immediately

## 🎯 Testing Instructions

### For Testers

1. **Start Testing:** Open `index.html` in your browser
2. **Follow Checklist:** Use the Tester Checklist in `requirements.md`
3. **Report Issues:** Create/update `Mistakes.md` with any failures
4. **Test All Roles:** Test as customer, staff, and admin

### Test Scenarios

#### Customer Flow
1. Register new account → C-01
2. Try duplicate email → C-02
3. Login → C-03
4. Browse products → C-07
5. Filter/sort products → C-08, C-09
6. Add to cart → C-10
7. Modify cart → C-11, C-12
8. Checkout with promo → C-13, C-14, C-15
9. Place order → C-16
10. View order history → C-20
11. Cancel order → C-22

#### Staff Flow
1. Login as staff → S-01
2. Add new product → S-02
3. Edit product → S-03
4. Update stock → S-05
5. View orders → S-08
6. Update order status → S-10
7. Generate reports → S-19

#### Admin Flow
1. Login as admin → A-01
2. Create staff account → A-02
3. Deactivate staff → A-03

## 🎨 Design Features

- **Color Scheme:** Pink (#e91e63) primary with modern accents
- **Typography:** Segoe UI for clean, readable text
- **Responsive:** Mobile-first design with breakpoints
- **Components:** Cards, tables, modals, forms, notifications
- **Icons:** Emoji-based icons for visual appeal

## 🔧 Technical Details

- **Vanilla JavaScript:** No frameworks or libraries required
- **Session Storage:** Cart and login state persist across page reloads
- **Mock Data:** Pre-populated products and test accounts
- **Client-Side Only:** No backend required for prototype

## 📝 Notes

- Payment processing is simulated (mock)
- Email notifications are simulated
- All data is stored in browser memory/session
- Refresh clears orders and cart (unless session stored)

## 🐛 Known Limitations

- No persistent database (data resets on browser close)
- No real email sending
- No real payment processing
- No file uploads for product images (using emoji placeholders)

## 📞 Support

For issues or questions about the prototype, please refer to the requirements in `requirements.md` or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** 2026-04-14
