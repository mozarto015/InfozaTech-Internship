# E-Commerce Backend API

A REST API built with Node.js, Express.js and MongoDB for an e-commerce application.

## Features

- User registration and login with JWT authentication
- Password hashing using bcrypt
- Role-based access control (User/Admin)
- Product management (CRUD operations)
- Shopping cart management
- Order placement and order history
- Stock validation and inventory updates

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/infrozatech_ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

4. Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |
| GET | `/api/cart` | View cart |
| POST | `/api/cart/items` | Add item |
| PUT | `/api/cart/items/:productId` | Update quantity |
| DELETE | `/api/cart/items/:productId` | Remove item |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | View order history |
| GET | `/api/orders/:id` | Get specific order |

Protected routes require a JWT Bearer token.

## Internship Project

**INFROZATECH — Task 5: E-Commerce Backend API**