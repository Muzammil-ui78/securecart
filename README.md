# 🛒 SecureCart — Full Stack E-Commerce Web Application

A full-stack e-commerce platform built with **Spring Boot** (backend) and **HTML/CSS/JavaScript** (frontend), featuring secure JWT authentication, role-based access control, product management, shopping cart, order tracking, and cloud deployment.

🌐 **Live Demo:** [securecart-muzammil.netlify.app](https://securecart-muzammil.netlify.app)  
💻 **GitHub:** [github.com/Muzammil-ui78/securecart](https://github.com/Muzammil-ui78/securecart)

---

## 📸 Screenshots

| Login | Products | Cart | Orders |
|---|---|---|---|
| Sign in with JWT auth | Browse & search products | Add to cart with details | Track order status |

---

## ✨ Features

### User Features
- 🔐 Register & Login with JWT authentication
- 🛍️ Browse products with search and price filter
- 🛒 Add to cart with product details (name, image, price)
- 📦 Place orders with delivery address and payment method (COD)
- 📋 View order history with product breakdown
- 🚚 Track order status (Pending → Shipped → Delivered)
- ❌ Cancel orders before delivery

### Admin Features
- ⚙️ Admin Dashboard (protected by ADMIN role)
- ➕ Add, Edit, Delete products
- 🖼️ Product image support via URL
- 📊 View all orders and manage status

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Programming language |
| Spring Boot 3.x | Backend framework |
| Spring Security | Authentication & authorization |
| JWT (jjwt) | Stateless token-based auth |
| Spring Data JPA | ORM layer |
| Hibernate | Database ORM |
| MySQL | Relational database |
| Maven | Build tool |
| Swagger / OpenAPI | API documentation |

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling (Amazon-inspired UI) |
| JavaScript (ES6+) | Dynamic functionality |
| Fetch API | REST API calls |

### Deployment
| Service | Purpose |
|---|---|
| Railway | Backend + MySQL cloud hosting |
| Netlify | Frontend hosting |
| GitHub | Version control |

---

## 🏗️ Project Structure

```
securecart/
├── src/
│   └── main/
│       ├── java/com/securecart/securecart/
│       │   ├── config/          # CORS, Security, OpenAPI config
│       │   ├── controller/      # REST API controllers
│       │   ├── dto/             # Data Transfer Objects
│       │   ├── exception/       # Global exception handling
│       │   ├── model/           # JPA entities
│       │   ├── repository/      # Spring Data JPA repositories
│       │   ├── security/        # JWT filter, utility, user details
│       │   └── service/         # Business logic
│       └── resources/
│           └── application.properties
├── Frontend/
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/
│   │       ├── api.js           # Base URL & auth headers
│   │       ├── auth.js          # Login, register, logout
│   │       ├── cart.js          # Cart operations
│   │       ├── order.js         # Order operations
│   │       ├── product.js       # Product listing & search
│   │       └── admin.js         # Admin dashboard
│   ├── pages/
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── products.html
│   │   ├── cart.html
│   │   ├── orders.html
│   │   └── admin.html
│   └── index.html               # Redirects to login
└── pom.xml
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login, returns JWT token | ❌ |
| GET | `/auth/me` | Get current user details | ✅ |

### Products
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | Get all products (supports `?search=&minPrice=&maxPrice=`) | ❌ |
| GET | `/api/products/{id}` | Get product by ID | ❌ |
| POST | `/api/products` | Add new product | ✅ ADMIN |
| PUT | `/api/products/{id}` | Update product | ✅ ADMIN |
| DELETE | `/api/products/{id}` | Delete product | ✅ ADMIN |

### Cart
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/cart` | Add item to cart | ✅ USER |
| GET | `/api/cart/{userId}` | Get cart with product details | ✅ USER |
| DELETE | `/api/cart/{id}` | Remove item from cart | ✅ USER |

### Orders
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders` | Place order from cart | ✅ USER |
| GET | `/api/orders?userId={id}` | Get user's orders | ✅ USER |
| GET | `/api/orders/{id}` | Get order by ID | ✅ USER |
| PUT | `/api/orders/{id}/cancel` | Cancel order | ✅ USER |
| PUT | `/api/orders/{id}/status` | Update order status | ✅ ADMIN |

---

## 🔐 Security

- JWT tokens are generated on login and expire after **24 hours**
- Every protected endpoint validates the JWT token via a custom `JwtFilter`
- Role-based access: `USER` for shopping, `ADMIN` for product management
- Passwords are hashed using **BCrypt** before storing in database
- CORS configured to allow only specific trusted origins

---

## 🚀 Running Locally

### Prerequisites
- Java 21+
- MySQL 8+
- Maven

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Muzammil-ui78/securecart.git
cd securecart
```

2. Create MySQL database:
```sql
CREATE DATABASE securecart;
```

3. Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/securecart
spring.datasource.username=root
spring.datasource.password=yourpassword
```

4. Run the application:
```bash
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

5. View API docs:
```
http://localhost:8080/swagger-ui/index.html
```

### Frontend Setup

Open `Frontend/assets/js/api.js` and set:
```js
const BASE_URL = "http://localhost:8080";
```

Then open `Frontend/pages/login.html` in your browser using Live Server.

---

## 📦 Database Schema

```
users         — id, name, email, password, role
products      — id, name, description, price, stock, image_url
cart_items    — id, user_id, product_id, quantity
orders        — id, user_id, total_amount, status, address, payment_method, created_at
order_items   — id, order_id, product_id, product_name, price, quantity
```

---

## 🌱 Future Improvements

- [ ] Razorpay payment gateway integration
- [ ] Product categories and filtering
- [ ] User profile and address management
- [ ] Product reviews and ratings
- [ ] Email notifications for order updates
- [ ] Mobile responsive redesign

---

## 👨‍💻 Developer

**Mohamed Muzammil**  
BTech CSBS Student  
📧 m2techguru@gmail.com  
🔗 [GitHub](https://github.com/Muzammil-ui78)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).