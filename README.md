# 🏥 MediStore API

A robust RESTful API for an online medicine store built with Node.js, Express, TypeScript, and Prisma. This API provides comprehensive functionality for managing medicines, categories, orders, shopping carts, reviews, and user authentication.

## ✨ Features

- **User Authentication** - Secure authentication using Better Auth with Google OAuth support
- **Medicine Management** - CRUD operations for medicines with categories and OTC flags
- **Shopping Cart** - Add, update, and remove items from cart
- **Order Management** - Create and manage orders with multiple payment methods
- **Review System** - Users can review medicines with ratings
- **Category Organization** - Organize medicines into categories
- **Role-Based Access** - User roles (USER, ADMIN) for access control
- **Database Migrations** - Prisma for type-safe database operations

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth
- **Process Manager**: tsx (for development)
- **Package Manager**: Yarn 4.9.2

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Yarn (v4.9.2)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd B6A4-MediStore-api
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/medistore"

   # Server
   PORT=5000

   # Better Auth
   BETTER_AUTH_URL="http://localhost:5000"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**

   ```bash
   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed admin user
   yarn seed::admin
   ```

## 🏃 Running the Application

### Development Mode

```bash
yarn dev
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

### Database Management

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (Database GUI)
npx prisma studio
```

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication

```
POST   /auth/sign-up
POST   /auth/sign-in
POST   /auth/sign-out
GET    /auth/session
```

### API v1 Routes

#### Medicines

```
GET    /api/v1/medicines         - Get all medicines
GET    /api/v1/medicines/:id     - Get medicine by ID
POST   /api/v1/medicines         - Create medicine (Admin)
PUT    /api/v1/medicines/:id     - Update medicine (Admin)
DELETE /api/v1/medicines/:id     - Delete medicine (Admin)
```

#### Categories

```
GET    /api/v1/categories        - Get all categories
GET    /api/v1/categories/:id    - Get category by ID
POST   /api/v1/categories        - Create category (Admin)
PUT    /api/v1/categories/:id    - Update category (Admin)
DELETE /api/v1/categories/:id    - Delete category (Admin)
```

#### Orders

```
GET    /api/v1/orders            - Get all orders
GET    /api/v1/orders/:id        - Get order by ID
POST   /api/v1/orders            - Create order
PUT    /api/v1/orders/:id        - Update order
DELETE /api/v1/orders/:id        - Delete order
```

#### Carts

```
GET    /api/v1/carts             - Get user cart
POST   /api/v1/carts             - Add item to cart
PUT    /api/v1/carts/:id         - Update cart item
DELETE /api/v1/carts/:id         - Remove item from cart
```

#### Reviews

```
GET    /api/v1/reviews           - Get all reviews
GET    /api/v1/reviews/:id       - Get review by ID
POST   /api/v1/reviews           - Create review
PUT    /api/v1/reviews/:id       - Update review
DELETE /api/v1/reviews/:id       - Delete review
```

#### Users

```
GET    /api/v1/users             - Get all users (Admin)
GET    /api/v1/users/:id         - Get user by ID
PUT    /api/v1/users/:id         - Update user
DELETE /api/v1/users/:id         - Delete user
```

## 📁 Project Structure

```
B6A4-MediStore-api/
├── prisma/
│   ├── migrations/           # Database migrations
│   └── schema/              # Prisma schema files
│       ├── auth.prisma
│       ├── cart.prisma
│       ├── category.prisma
│       ├── medicine.prisma
│       ├── order.prisma
│       ├── review.prisma
│       └── schema.prisma
├── src/
│   ├── config/              # Configuration files
│   │   ├── env.ts          # Environment variables
│   │   └── permission.ts   # Permission settings
│   ├── helpers/            # Helper functions
│   ├── lib/                # Library setup
│   │   ├── auth.ts         # Better Auth configuration
│   │   └── prisma.ts       # Prisma client
│   ├── middlewares/        # Express middlewares
│   ├── modules/            # Feature modules
│   │   ├── cart/
│   │   ├── category/
│   │   ├── medicine/
│   │   ├── order/
│   │   ├── review/
│   │   └── user/
│   ├── routes/             # API routes
│   │   └── v1/
│   ├── scripts/            # Utility scripts
│   ├── types/              # TypeScript types
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── .env                    # Environment variables
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

This API uses [Better Auth](https://better-auth.com/) for authentication with the following features:

- Email/Password authentication
- Google OAuth
- Session management
- Role-based access control (USER, ADMIN)

## 🗄️ Database Schema

The application uses the following main models:

- **User** - User accounts with roles and authentication
- **Medicine** - Medicine products with pricing and inventory
- **Category** - Product categories
- **Cart** - Shopping cart for users
- **CartItem** - Items in shopping carts
- **Order** - Customer orders with shipping details
- **OrderItem** - Items in orders
- **Review** - Product reviews and ratings

## 📜 Available Scripts

```bash
# Start development server with hot reload
yarn dev

# Seed admin user
yarn seed::admin

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of an assignment (B6A4) for Next Level Web Development.

## 🐛 Known Issues

Please report any issues in the issue tracker.

## 📞 Support

For support, please contact the development team.

---

**Happy Coding! 🚀**
