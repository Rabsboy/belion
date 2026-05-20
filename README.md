# 🍔 Online Food Ordering System

A modern, full-stack food ordering platform built with Laravel 11, React (Inertia.js), and Tailwind CSS. Features role-based dashboards, real-time order management, integrated payment gateway (SSLCommerz), and a seamless user experience.

---

## ✨ Key Features

### 🛡️ Multi-Role System
- **Admin Dashboard**: Complete control over products, categories, orders, customers, coupons, reports, and settings
- **Customer Dashboard**: Order history, profile management, and password updates
- **Guest Access**: Browse menu and contact support without authentication

### 🍕 Product Management
- Categories with images
- Products with multiple images, variations (sizes), and extra options (toppings)
- Dynamic pricing based on variations and options
- Search and filter functionality

### 🛒 Shopping Experience
- Real-time cart management (localStorage)
- Product customization (variations + options with quantity)
- Coupon code application with validation
- Live price calculations (subtotal, delivery fee, discount, total)

### 💳 Payment Integration
- **SSLCommerz** payment gateway (sandbox & live modes)
- Order status tracking: pending → preparing → out_for_delivery → delivered
- Payment status: pending, paid, failed
- Repayment option for failed transactions

### 📊 Admin Features
- Dashboard with stats: total orders, revenue, products, customers
- Order management with status updates and delivery tracking URLs
- Customer management with ban/unban functionality
- Coupon management (percentage/fixed, minimum order, expiry, usage limits)
- Reports & analytics (monthly revenue charts, best-selling products, year filters)
- Contact request management with email notifications
- Global settings (delivery fee configuration)

### 📧 Email Notifications
- Contact request status updates (pending → resolved)
- Automated email sending upon status change
- Customizable email templates

### 🔒 Security & Validation
- CSRF protection (except payment callbacks)
- Phone number validation (Bangladeshi format: 01[3-9]XXXXXXXX)
- Email validation
- Password requirements (8+ chars, uppercase, lowercase, special char)
- Role-based middleware protection

---

## 🛠️ Tech Stack

### Backend
- **Laravel 11** (PHP 8.2+)
- **Inertia.js** (SPA without API)
- **MySQL** (Database)
- **SSLCommerz** (Payment Gateway)

### Frontend
- **React 18** (UI Library)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Vite** (Build Tool)

### Additional Libraries
- `lodash.debounce` (Search optimization)
- `react-chartjs-2` & `chart.js` (Analytics charts)

---

## 📁 Project Structure

```
online-food-ordering-system/
├── app/
│   ├── Features/                    # Feature-based architecture
│   │   ├── Admin/                   # Admin features
│   │   │   ├── Controllers/
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   ├── CouponController.php
│   │   │   │   ├── CustomerController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── ProfileController.php
│   │   │   │   ├── ReportController.php
│   │   │   │   └── SettingController.php
│   │   │   ├── Models/
│   │   │   │   ├── Category.php
│   │   │   │   ├── Coupon.php
│   │   │   │   ├── Product.php
│   │   │   │   └── Setting.php
│   │   │   └── routes.php           # Admin routes
│   │   ├── Auth/                    # Authentication
│   │   │   ├── Controllers/
│   │   │   │   ├── LoginController.php
│   │   │   │   ├── RegisterController.php
│   │   │   │   └── PasswordResetController.php
│   │   │   └── routes.php           # Auth routes
│   │   ├── Customer/                # Customer features
│   │   │   ├── Controllers/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── MyOrderController.php
│   │   │   │   └── ProfileController.php
│   │   │   └── routes.php           # Customer routes
│   │   ├── Menu/                    # Product catalog
│   │   │   ├── Controllers/
│   │   │   │   └── MenuController.php
│   │   │   └── routes.php           # Menu routes
│   │   ├── Order/                   # Order management
│   │   │   ├── Controllers/
│   │   │   │   ├── CheckoutController.php
│   │   │   │   └── PaymentController.php
│   │   │   ├── Models/
│   │   │   │   ├── Order.php
│   │   │   │   ├── OrderItem.php
│   │   │   │   └── Payment.php
│   │   │   └── routes.php           # Order routes
│   │   ├── About/                   # Static pages
│   │   │   ├── Controllers/
│   │   │   │   └── AboutController.php
│   │   │   └── routes.php           # About routes
│   │   └── Contact/                 # Contact messages
│   │       ├── Controllers/
│   │       │   └── ContactController.php
│   │       ├── Models/
│   │       │   └── ContactMessage.php
│   │       └── routes.php           # Contact routes
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Controller.php
│   │   └── Middleware/
│   │       ├── CheckRole.php        # Role verification
│   │       └── HandleInertiaRequests.php
│   ├── Mail/
│   │   └── GenericMail.php          # Email template
│   ├── Models/
│   │   └── User.php                 # User model
│   └── Providers/
│       └── RouteServiceProvider.php # Auto-loads feature routes
├── bootstrap/
│   ├── app.php                      # Application bootstrap
│   ├── providers.php
│   └── cache/
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── database.php
│   ├── mail.php
│   ├── services.php                 # SSLCommerz config
│   └── session.php
├── database/
│   ├── migrations/
│   │   ├── 2024_*_create_users_table.php
│   │   ├── 2024_*_create_categories_table.php
│   │   ├── 2024_*_create_products_table.php
│   │   ├── 2024_*_create_orders_table.php
│   │   ├── 2024_*_create_order_items_table.php
│   │   ├── 2024_*_create_coupons_table.php
│   │   ├── 2024_*_create_payments_table.php
│   │   ├── 2024_*_create_settings_table.php
│   │   ├── 2024_*_create_contact_messages_table.php
│   │   └── 2024_*_add_product_name_to_order_items_table.php
│   └── seeders/
├── public/
│   ├── upload/                      # User uploads
│   │   ├── product/                 # Product images
│   │   └── category/                # Category images
│   └── build/                       # Compiled assets
├── resources/
│   ├── js/
│   │   ├── Components/              # Reusable React components
│   │   │   ├── CartSummary.jsx
│   │   │   ├── DangerButton.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── InputError.jsx
│   │   │   ├── InputLabel.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── TextInput.jsx
│   │   │   └── Toast.jsx
│   │   ├── Features/                # Page components (Inertia pages)
│   │   │   ├── About/
│   │   │   │   ├── About/
│   │   │   │   │   └── About.jsx
│   │   │   │   ├── CookiePolicy/
│   │   │   │   │   └── CookiePolicy.jsx
│   │   │   │   ├── PrivacyPolicy/
│   │   │   │   │   └── PrivacyPolicy.jsx
│   │   │   │   └── TermsAndConditions/
│   │   │   │       └── TermsAndConditions.jsx
│   │   │   ├── Admin/
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── ContactRequests.jsx
│   │   │   │   ├── Coupons.jsx
│   │   │   │   ├── Customers.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── Settings.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Contact/
│   │   │   │   └── Contact.jsx
│   │   │   ├── Customer/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── Home/
│   │   │   │   └── Home.jsx
│   │   │   ├── Menu/
│   │   │   │   └── Menu.jsx
│   │   │   └── Orders/
│   │   │       └── Checkout.jsx
│   │   ├── Layouts/                 # Layout components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── CustomerLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   ├── Utils/
│   │   │   └── validation.js        # Validation helpers
│   │   ├── app.jsx                  # Inertia app entry
│   │   └── bootstrap.js
│   ├── css/
│   │   └── app.css                  # Tailwind imports
│   └── views/
│       ├── app.blade.php            # Main Inertia template
│       └── emails/
│           └── contact/
│               └── status-updated.blade.php
├── routes/
│   └── web.php                      # Main web routes (includes feature routes)
├── .env.example                     # Environment template
├── .env                             # Environment config (not in repo)
├── artisan                          # Laravel CLI
├── composer.json                    # PHP dependencies
├── package.json                     # Node dependencies
├── phpunit.xml                      # Testing config
├── postcss.config.js                # PostCSS config
├── tailwind.config.js               # Tailwind config
├── vite.config.js                   # Vite config
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **PHP 8.2+** with extensions: OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath
- **Composer** (latest)
- **Node.js 18+** & **npm**
- **MySQL 8.0+**
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rifatxtra/Quick-Feast-Online-Food-Ordering-System.git
cd online-food-ordering-system
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install Node dependencies**
```bash
npm install
```

4. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configure `.env`**
```env
APP_NAME="QuickFeast - Online Food Ordering System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=food_ordering
DB_USERNAME=root
DB_PASSWORD=your_password

# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_password
SSLCOMMERZ_SANDBOX=true  # false for production

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@quickfeast.com
MAIL_FROM_NAME="QuickFeast - Online Food Ordering System"
```

6. **Database setup**
```bash
php artisan migrate
php artisan db:seed  # Optional: seed sample data
```

7. **Create storage symlink**
```bash
php artisan storage:link
```

8. **Build frontend assets**
```bash
npm run dev   # Development mode with hot reload
# OR
npm run build # Production build
```

9. **Start development server**
```bash
php artisan serve
```

Visit: `http://localhost:8000`

---

## 👥 Default Credentials

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `password`

### Customer Account
- **Email**: `customer@example.com`
- **Password**: `password`

*(Create these manually or via seeder)*

---

## 🔌 API Endpoints

### Public Routes
```
GET  /                       - Home page
GET  /menu                   - Browse menu
GET  /about                  - About us
GET  /contact                - Contact page
POST /contact                - Submit contact form
GET  /privacy-policy         - Privacy policy
GET  /terms-and-conditions   - Terms & conditions
GET  /cookie-policy          - Cookie policy
```

### Auth Routes
```
GET  /login                  - Login page
POST /login                  - Authenticate user
GET  /register               - Registration page
POST /register               - Create new account
POST /logout                 - Logout
GET  /forgot-password        - Password reset request
POST /forgot-password        - Send reset link
GET  /reset-password/{token} - Reset password form
POST /reset-password         - Update password
```

### Customer Routes (auth + customer role)
```
GET  /customer/dashboard     - Customer dashboard
GET  /customer/my-orders     - Order history
GET  /customer/profile       - Profile page
PUT  /customer/profile       - Update profile
PUT  /customer/profile/password - Change password
```

### Order & Payment Routes (auth)
```
GET  /checkout               - Checkout page
POST /checkout               - Place order
POST /payment/init           - Initialize payment
POST /payment/success        - Payment success callback
POST /payment/fail           - Payment fail callback
POST /payment/cancel         - Payment cancel callback
POST /payment/ipn            - Payment IPN callback
POST /payment/repay/{order}  - Retry payment
```

### Admin Routes (auth + admin role)
```
GET  /admin/dashboard        - Admin dashboard
GET  /admin/profile          - Admin profile
PUT  /admin/profile          - Update admin profile
PUT  /admin/profile/password - Change admin password

# Categories
GET  /admin/categories       - List categories
POST /admin/categories       - Create category
PUT  /admin/categories/{id}  - Update category
DELETE /admin/categories/{id} - Delete category

# Products
GET  /admin/products         - List products (with search)
POST /admin/products         - Create product
PUT  /admin/products/{id}    - Update product
DELETE /admin/products/{id}  - Delete product

# Orders
GET  /admin/orders           - List all orders
PUT  /admin/orders/{id}      - Update order status

# Coupons
GET  /admin/coupons          - List coupons
POST /admin/coupons          - Create coupon
PUT  /admin/coupons/{id}     - Update coupon
DELETE /admin/coupons/{id}   - Delete coupon

# Customers
GET  /admin/customers        - List customers
PUT  /admin/customers/{id}/toggle-ban - Ban/unban customer

# Reports
GET  /admin/reports          - Analytics & reports

# Contact Requests
GET  /admin/contact-requests - List contact messages
PUT  /admin/contact-requests/{id} - Update status (auto-emails user)

# Settings
GET  /admin/settings         - Settings page
PUT  /admin/settings         - Update settings (delivery fee)
```

---

## 🎨 UI Components

### Layouts
- **PublicLayout**: Navbar + Footer (for guests)
- **AdminLayout**: Sidebar navigation + Toast notifications
- **CustomerLayout**: Sidebar navigation + Toast notifications

### Reusable Components
- **Navbar**: Responsive navigation with cart indicator
- **CartSummary**: Sliding cart panel with item management
- **Toast**: Auto-dismiss notifications (success/error/info)
- **Pagination**: Laravel-style pagination component
- **Modal**: Centered modal dialogs
- **InputError**: Form validation error display
- **InputLabel**: Accessible form labels
- **TextInput**: Styled text inputs
- **PrimaryButton/DangerButton**: Styled action buttons

### Features
- **Product Customization Modal**: Select variations + add options with quantities
- **Password Strength Indicator**: Real-time validation feedback
- **Phone Number Formatting**: Auto-format Bangladeshi phone numbers
- **Cart Persistence**: localStorage-based cart state
- **Loading States**: Processing indicators on forms
- **Responsive Design**: Mobile-first, fully responsive

---

## 🔧 Key Functionality

### Product System
- **Categories**: Name, image, timestamps
- **Products**: 
  - Base price
  - Variations (e.g., Small ৳50, Large ৳100)
  - Options (e.g., Extra Cheese ৳20, can add multiple with quantity)
  - Multiple images support
  - Description

### Cart Logic (Frontend)
```javascript
// Cart item structure
{
  id: productId,
  name: "Product Name",
  base_price: 100,
  images_name: "path/to/image.jpg",
  quantity: 2,
  variation: { name: "Large", price: 50 },  // optional
  selectedOptions: [
    { name: "Extra Cheese", price: 20, quantity: 2 }
  ]
}

// Price calculation
itemTotal = (base_price + variation.price + sum(option.price * option.quantity)) * quantity
```

### Order Flow
1. Customer adds items to cart
2. Proceeds to checkout
3. Enters delivery details + applies coupon (optional)
4. Submits order (creates order + order_items + payment record)
5. Redirected to SSLCommerz payment page
6. Payment callback updates order status
7. Admin can track & update order status
8. Customer sees order history with payment status

### Coupon Validation
- Check if code exists and is active
- Verify expiry date
- Check minimum order amount
- Validate usage limit
- Calculate discount (percentage or fixed)

### Email Notifications
- Triggered when admin updates contact request status
- Uses Laravel's Mail facade with Blade templates
- Deferred execution for performance
- Customizable templates in `resources/views/emails/`

---

## 🔒 Security Features

- **CSRF Protection**: All forms except payment callbacks
- **Role-Based Access**: Middleware-protected routes
- **Password Hashing**: Bcrypt
- **SQL Injection Prevention**: Eloquent ORM
- **XSS Protection**: React auto-escaping
- **Validation**: Server-side + client-side
- **Phone Validation**: Regex pattern `/^01[3,4,6,7,8,9]\d{8}$/`
- **Email Validation**: RFC-compliant
- **Password Policy**: Min 8 chars, 1 uppercase, 1 lowercase, 1 special char

---

## 📊 Database Schema

### Key Tables
- **users**: id, name, email, password, phone, role (admin/customer), is_banned, timestamps
- **categories**: id, name, image, timestamps
- **products**: id, category_id, name, price, description, images_name, variations (JSON), options (JSON), timestamps
- **orders**: id, user_id, delivery_name, delivery_phone, delivery_email, delivery_address, status, payment_status, subtotal, delivery_fee, discount, total, delivery_tracking_url, timestamps
- **order_items**: id, order_id, product_id, product_name, variation (JSON), selected_options (JSON), quantity, unit_price, line_total, timestamps
- **coupons**: id, code, type (percentage/fixed), value, min_order, max_usage, used_count, expires_at, is_active, timestamps
- **payments**: id, order_id, transaction_id, amount, status, gateway_response (JSON), timestamps
- **settings**: id, key, value, timestamps
- **contact_messages**: id, name, email, phone, subject, message, status, timestamps

---

## 📚 Study Guide

### For Backend Developers

**Start Here**:
1. [`app/Providers/RouteServiceProvider.php`](app/Providers/RouteServiceProvider.php) - Auto-loading feature routes
2. [`app/Features/Order/Controllers/CheckoutController.php`](app/Features/Order/Controllers/CheckoutController.php) - Order processing
3. [`app/Features/Order/Controllers/PaymentController.php`](app/Features/Order/Controllers/PaymentController.php) - SSLCommerz integration
4. [`app/Features/Admin/Controllers/OrderController.php`](app/Features/Admin/Controllers/OrderController.php) - Order management

**Key Concepts**:
- Feature-based folder structure
- Inertia.js responses (`Inertia::render()`)
- Eloquent relationships
- File upload handling
- JSON storage (variations, options)
- Payment gateway callbacks
- Email sending with Laravel Mail

**Best Practices**:
- Validate all inputs
- Use Eloquent instead of raw queries
- Return Inertia responses for SPA navigation
- Store structured data in JSON columns
- Use transactions for multi-step operations
- Defer email sending for performance

### For Frontend Developers

**Start Here**:
1. [`resources/js/app.jsx`](resources/js/app.jsx) - Inertia setup
2. [`resources/js/Features/Menu/Menu.jsx`](resources/js/Features/Menu/Menu.jsx) - Product display and cart
3. [`resources/js/Features/Orders/Checkout.jsx`](resources/js/Features/Orders/Checkout.jsx) - Checkout flow
4. [`resources/js/Components/`](resources/js/Components/) - Reusable components

**Key Concepts**:
- Inertia.js (SPA without API)
- React state management (useState)
- Form handling with Inertia (`useForm`)
- Client-side validation patterns
- Error handling and display
- Cart state management (localStorage)
- Toast notifications

**Best Practices**:
- Always validate user input
- Provide clear error messages
- Use loading states during async operations
- Keep calculations in sync with backend
- Accessible form design
- Debounce search inputs
- Optimize re-renders with useMemo/useCallback

### For Full-Stack Developers

**Critical Files**:
1. [`app/Features/Order/Controllers/CheckoutController.php`](app/Features/Order/Controllers/CheckoutController.php) + [`resources/js/Features/Orders/Checkout.jsx`](resources/js/Features/Orders/Checkout.jsx)
2. [`app/Features/Admin/Controllers/ProductController.php`](app/Features/Admin/Controllers/ProductController.php) + [`resources/js/Features/Admin/Products.jsx`](resources/js/Features/Admin/Products.jsx)
3. [`app/Http/Middleware/HandleInertiaRequests.php`](app/Http/Middleware/HandleInertiaRequests.php)

**Data Flow**:
```
User Interaction (React)
  ↓
Inertia Form Submission
  ↓
Laravel Route → Controller
  ↓
Validation → Business Logic
  ↓
Database (Eloquent)
  ↓
Inertia Response
  ↓
React Re-render
```

---

## 🧪 Testing

### Run Tests
```bash
php artisan test
```

### Key Test Areas
- Authentication (login, register, password reset)
- Cart calculations
- Order creation and validation
- Coupon application logic
- Payment callback handling
- Admin CRUD operations
- Role-based access control

---

## 🚢 Deployment

### Production Checklist

1. **Environment**
```bash
# Set production values
APP_ENV=production
APP_DEBUG=false
SSLCOMMERZ_SANDBOX=false
```

2. **Optimize**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

3. **Permissions**
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

4. **Database**
```bash
php artisan migrate --force
```

5. **Queue Worker** (for emails)
```bash
php artisan queue:work --daemon
# Or use Supervisor for process management
```

6. **Server Requirements**
- PHP 8.2+ with required extensions
- Composer 2.x
- MySQL 8.0+
- Node.js 18+ (for building assets)
- SSL certificate (for payment gateway)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Guidelines**:
- Follow PSR-12 coding standards (PHP)
- Use ESLint/Prettier for JavaScript
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Rifat Islam**
- Website: [rifatxtra.com](https://rifatxtra.com)
- Email: contact@rifatxtra.com
- GitHub: [@rifatxtra](https://github.com/rifatxtra)

---

## 🙏 Acknowledgments

- Laravel framework and community
- Inertia.js for seamless SPA experience
- SSLCommerz for payment processing
- Tailwind CSS for rapid UI development
- Lucide React for beautiful icons

---

## 📞 Support

For issues and questions:
1. Check existing [GitHub Issues](https://github.com/rifatxtra/Quick-Feast-Online-Food-Ordering-System/issues)
2. Create a new issue with detailed information
3. Email: contact@rifatxtra.com

---

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Real-time order tracking with WebSockets
- [ ] Progressive Web App (PWA)
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard
- [ ] Loyalty program and rewards
- [ ] Multi-vendor support
- [ ] Pickup option (in addition to delivery)
- [ ] Table reservation system
- [ ] API for third-party integrations

---

**Made with ❤️ by Rifat Islam**