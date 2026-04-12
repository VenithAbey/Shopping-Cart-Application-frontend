# ShopCart - Shopping Cart Application

A modern, full-stack shopping cart application built with React (Next.js) frontend and Spring Boot backend with MySQL database.

## Project Overview

ShopCart is a complete e-commerce solution featuring:
- User authentication (signup/login)
- Product catalog with categories and search
- Shopping cart management
- Checkout flow with order summary
- Admin dashboard for product and category management
- Order history tracking

## Technology Stack

### Frontend
- **Framework**: Next.js 15+ with React 19
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React

### Backend
- **Framework**: Spring Boot 3+
- **Database**: MySQL 8.0+
- **ORM**: Hibernate/JPA
- **Security**: Spring Security with JWT
- **API**: RESTful

## Quick Start

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. **Demo Credentials**
   - **User**: demo@example.com / demo123
   - **Admin**: admin@example.com / admin123

### Backend Setup (Spring Boot)

#### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+

#### Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE shopcart;
   USE shopcart;
   ```

2. **Create Tables**

   ```sql
   -- Users Table
   CREATE TABLE users (
     id BIGINT PRIMARY KEY AUTO_INCREMENT,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     name VARCHAR(255) NOT NULL,
     role ENUM('user', 'admin') DEFAULT 'user',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   -- Categories Table
   CREATE TABLE categories (
     id BIGINT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL UNIQUE,
     description TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Products Table
   CREATE TABLE products (
     id BIGINT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     description TEXT,
     price DECIMAL(10, 2) NOT NULL,
     stock INT NOT NULL DEFAULT 0,
     category_id BIGINT NOT NULL,
     image_url VARCHAR(500),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (category_id) REFERENCES categories(id)
   );

   -- Cart Items Table
   CREATE TABLE cart_items (
     id BIGINT PRIMARY KEY AUTO_INCREMENT,
     user_id BIGINT NOT NULL,
     product_id BIGINT NOT NULL,
     quantity INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (product_id) REFERENCES products(id)
   );

   -- Orders Table
   CREATE TABLE orders (
     id BIGINT PRIMARY KEY AUTO_INCREMENT,
     user_id BIGINT NOT NULL,
     order_number VARCHAR(50) UNIQUE NOT NULL,
     total_amount DECIMAL(10, 2) NOT NULL,
     status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
     shipping_address TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );

   -- Order Items Table
   CREATE TABLE order_items (
     id BIGINT PRIMARY KEY AUTO_INCREMENT,
     order_id BIGINT NOT NULL,
     product_id BIGINT NOT NULL,
     quantity INT NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     FOREIGN KEY (order_id) REFERENCES orders(id),
     FOREIGN KEY (product_id) REFERENCES products(id)
   );

   -- Insert Sample Data
   INSERT INTO categories (name, description) VALUES
   ('vegetables', 'Fresh organic vegetables'),
   ('fruits', 'Fresh seasonal fruits'),
   ('cakes', 'Homemade delicious cakes'),
   ('biscuits', 'Crispy and tasty biscuits');

   INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
   ('Fresh Vegetables Mix', 'Organic fresh vegetables', 12.99, 50, 1, 'https://images.unsplash.com/photo-1505521585163-38f1f2af3f81?w=400'),
   ('Organic Tomatoes', 'Fresh red tomatoes from farm', 8.99, 40, 1, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400'),
   ('Fresh Fruits Assorted', 'Mixed fresh fruits', 15.99, 35, 2, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'),
   ('Chocolate Cake', 'Delicious homemade chocolate cake', 24.99, 15, 3, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400');

   INSERT INTO users (email, password, name, role) VALUES
   ('demo@example.com', 'demo123', 'Demo User', 'user'),
   ('admin@example.com', 'admin123', 'Admin User', 'admin');
   ```

#### Spring Boot Configuration

1. **Create Spring Boot Project**
   ```bash
   # Using Spring Boot CLI or through Spring Initializr
   spring boot create --from-template shopcart
   ```

2. **pom.xml Dependencies**
   ```xml
   <dependencies>
     <!-- Spring Boot Starters -->
     <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
     </dependency>
     <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-jpa</artifactId>
     </dependency>
     <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-security</artifactId>
     </dependency>
     
     <!-- Database -->
     <dependency>
       <groupId>com.mysql</groupId>
       <artifactId>mysql-connector-java</artifactId>
       <version>8.0.33</version>
     </dependency>
     
     <!-- JWT -->
     <dependency>
       <groupId>io.jsonwebtoken</groupId>
       <artifactId>jjwt-api</artifactId>
       <version>0.12.3</version>
     </dependency>
     
     <!-- Lombok -->
     <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
       <optional>true</optional>
     </dependency>
   </dependencies>
   ```

3. **application.yml Configuration**
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/shopcart
       username: root
       password: your_password
       driver-class-name: com.mysql.cj.jdbc.Driver
     jpa:
       hibernate:
         ddl-auto: update
       show-sql: false
       properties:
         hibernate:
           dialect: org.hibernate.dialect.MySQL8Dialect
     servlet:
       multipart:
         max-file-size: 10MB
         max-request-size: 10MB
   
   jwt:
     secret: your_jwt_secret_key_here
     expiration: 86400000  # 24 hours
   
   cors:
     allowed-origins: http://localhost:3000
   ```

4. **Run Spring Boot Application**
   ```bash
   mvn spring-boot:run
   ```
   Backend will be available at `http://localhost:8080`

## Frontend Features

### Pages

1. **Login/Register** (`/`)
   - Email/password authentication
   - Demo credentials for testing
   - Role-based access control

2. **Products** (`/`)
   - Browse all products
   - Filter by category
   - Search functionality
   - Add to cart

3. **Cart** (`/cart`)
   - View cart items
   - Adjust quantities
   - Remove items
   - Order summary with tax calculation

4. **Checkout** (`/checkout`)
   - Shipping information form
   - Payment details
   - Order confirmation

5. **Orders** (`/orders`)
   - View order history
   - Track order status

6. **Admin Dashboard** (`/admin`)
   - Product management (CRUD)
   - Category management
   - Order management

## API Endpoints (Spring Boot)

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `DELETE /api/categories/{id}` - Delete category (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/{itemId}` - Update cart item
- `DELETE /api/cart/{itemId}` - Remove from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}/status` - Update order status (admin)

## Color Scheme

- **Primary Background**: Slate-900 (#0f172a)
- **Secondary Background**: Slate-800 (#1e293b)
- **Accent Color**: Blue-600 (#2563eb)
- **Text Primary**: White (#ffffff)
- **Text Secondary**: Slate-400 (#94a3b8)

## Key Features Implementation

### Authentication Flow
1. User enters credentials
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token included in subsequent API requests

### Product Catalog
- Fetches products from `/api/products`
- Filters by category
- Real-time search
- Responsive grid layout

### Shopping Cart
- Persisted in localStorage
- Real-time updates across components
- Quantity management
- Price calculations with tax

### Checkout Process
1. Validate cart contents
2. Collect shipping information
3. Process payment
4. Create order in database
5. Send confirmation email
6. Clear cart and show success page

## Security Considerations

1. **Password Hashing**: Use bcrypt in Spring Boot
2. **JWT Tokens**: Include in Authorization header
3. **CORS**: Configure allowed origins
4. **Input Validation**: Validate all user inputs
5. **SQL Injection**: Use parameterized queries/JPA
6. **XSS Protection**: React automatically escapes content
7. **HTTPS**: Use in production

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build folder to Vercel/Netlify
```

### Backend (Heroku/AWS/DigitalOcean)
```bash
# Build JAR
mvn clean package

# Deploy JAR to your hosting provider
java -jar target/shopcart-1.0.0.jar
```

## Troubleshooting

### Frontend Issues
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`
- Check console for errors

### Backend Issues
- Verify MySQL is running
- Check database connection settings
- Verify JWT secret is set
- Check CORS configuration

## Development Tips

1. **Mock Authentication**: Current frontend uses mock auth. Update `/api/auth/*` routes to call actual Spring Boot backend.

2. **Product Images**: Replace with actual product images or CDN URLs.

3. **Payment Processing**: Integrate with Stripe/PayPal in checkout flow.

4. **Email Notifications**: Add email service for order confirmations.

5. **Admin Features**: Expand admin dashboard with more analytics and reporting.

## File Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── orders/           # Order history
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home/products page
├── components/
│   ├── auth/             # Authentication components
│   ├── Navigation.tsx    # Navigation bar
│   ├── ProductCard.tsx   # Product card
│   ├── ProductCatalog.tsx # Product listing
│   ├── CategoryFilter.tsx # Category filter
│   └── SearchBar.tsx     # Search functionality
├── contexts/
│   ├── AuthContext.tsx   # Authentication context
│   └── CartContext.tsx   # Shopping cart context
├── app/globals.css       # Global styles
└── package.json          # Dependencies
```

## Next Steps

1. Set up Spring Boot backend following the guide above
2. Update API endpoints to connect to real backend
3. Implement payment gateway integration
4. Add email notifications
5. Deploy to production
6. Monitor performance and user analytics

## Support

For issues or questions, check the troubleshooting section or review the application logs. The mock data in the frontend can be replaced with actual API calls to your Spring Boot backend.

---

**Happy shopping! 🛒**
