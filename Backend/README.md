# Credit Jambo - Client Backend

Backend API server for the Credit Jambo client application, providing user-facing functionality for account management, transactions, and device tracking.

## Features

- User registration and authentication
- Profile management
- Transaction processing (deposits/withdrawals)
- Device registration and tracking
- Notification management
- Wallet balance management
- Password change functionality

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer for notifications
- **Validation**: Custom validation utilities
- **Security**: bcrypt for password hashing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

## Installation

1. Navigate to the Client/Backend directory:
   ```bash
   cd Client/Backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Configure the following variables in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/credit_jambo_client?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   PORT=3600
   FRONTEND_URL="http://localhost:3001"
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ```

## Database Setup

1. Ensure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE credit_jambo_client;
   ```

2. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Development

Start the development server:
```bash
pnpm run dev
```

The server will start on `http://localhost:3600`

## Production Build

1. Build the application:
   ```bash
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - Logout

### User Profile
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `PUT /api/v1/user/password` - Change password

### Transactions
- `POST /api/v1/user/deposit` - Make deposit
- `POST /api/v1/user/withdraw` - Make withdrawal
- `GET /api/v1/user/transactions` - Get transaction history

### Devices
- `POST /api/v1/user/devices` - Register device
- `GET /api/v1/user/devices` - Get user devices
- `PUT /api/v1/user/devices/:id` - Update device
- `DELETE /api/v1/user/devices/:id` - Delete device

### Notifications
- `GET /api/v1/user/notifications` - Get user notifications
- `PUT /api/v1/user/notifications/:id/read` - Mark notification as read
- `PUT /api/v1/user/notifications/read-all` - Mark all as read

## Project Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── repositories/    # Database operations
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── middleware/      # Express middleware
└── index.ts         # Application entry point
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `PORT` | Server port (default: 3600) | No |
| `FRONTEND_URL` | Client frontend URL | Yes |
| `SMTP_HOST` | Email SMTP host | No |
| `SMTP_PORT` | Email SMTP port | No |
| `SMTP_USER` | Email SMTP username | No |
| `SMTP_PASS` | Email SMTP password | No |

## Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm start` - Start production server
- `pnpm run lint` - Run ESLint

## Security Notes

- JWT secrets should be strong and unique
- Database credentials should never be committed
- Use HTTPS in production
- Regularly update dependencies for security patches