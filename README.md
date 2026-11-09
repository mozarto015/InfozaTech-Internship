# INFOZATECH Internship Projects

This repository contains the backend development projects I completed during my internship at **INFOZATECH**.

## Projects

### Task 3 – URL Shortener

A URL shortening application built using Node.js, Express.js and MongoDB.

**Features:**
- Convert long URLs into short URLs.
- Redirect users to the original URL.
- Store URLs in MongoDB.
- Track the number of clicks.
- View saved URLs.

**Technologies:** Node.js, Express.js, MongoDB, Mongoose, EJS.

### Task 4 – Background Job & Notification Service

A backend service that handles notification tasks using a background job queue.

**Features:**
- Queue notification jobs through an API.
- Process jobs in the background.
- Retry failed jobs.
- Check job status using an API endpoint.

**Technologies:** Node.js, Express.js, BullMQ, Redis, ioredis.

### Task 5 – E-Commerce Backend API

A REST API for an e-commerce application with authentication, product management, shopping cart and order functionality.

**Features:**
- User registration and login using JWT.
- Password hashing with bcrypt.
- User and admin role-based access.
- Product management (CRUD).
- Shopping cart management.
- Order placement and order history.
- Product stock validation and inventory updates.

**Technologies:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.

## Installation

Each project has its own folder and dependencies.

1. Clone this repository:

```bash
git clone https://github.com/mozarto015/InfrozaTech-Internship.git
```

2. Open the folder of the project you want to run.

3. Install dependencies:

```bash
npm install
```

4. Configure the required environment variables in a `.env` file.

5. Start the project using its configured start script.

Refer to the individual project README files for specific setup instructions.

## Author

**Aditya Shaw**

- GitHub: [mozarto015](https://github.com/mozarto015)
- LinkedIn: [Aditya Shaw](https://www.linkedin.com/in/aditya-shaw-b71116308/)

---

*Completed as part of the INFROZATECH Backend Development Internship.*
