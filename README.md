# Credit Jambo - Client Application

A comprehensive client-side financial management platform for managing personal credit, transactions, and wallet operations.

## Overview

Credit Jambo Client is a modern web application that provides users with a complete financial dashboard to manage their credit accounts, track transactions, and handle wallet operations. Built with Next.js and TypeScript for a robust and scalable user experience.

## Features

### User Management
- **User Registration & Authentication** - Secure account creation and login
- **Profile Management** - Update personal information and preferences
- **Device Management** - Track and manage registered devices

### Wallet Operations
- **Balance Management** - View current wallet balance and history
- **Deposit Funds** - Add money to wallet through various payment methods
- **Withdraw Funds** - Transfer money from wallet to external accounts
- **Transaction History** - Detailed view of all financial activities

### Dashboard & Analytics
- **Financial Overview** - Real-time balance and transaction summaries
- **Transaction Tracking** - Monitor all deposits, withdrawals, and transfers
- **Notifications** - Real-time alerts for account activities
- **Settings Management** - Customize account preferences and security

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **State Management**: TanStack Query (React Query)
- **Authentication**: JWT with secure cookie storage
- **API Communication**: Axios with custom API client
- **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
Client/
├── Frontend/          # Next.js client application
│   ├── app/          # App router pages
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utilities, services, and hooks
│   └── public/       # Static assets
└── Backend/          # Node.js API server
    ├── src/          # Source code
    └── prisma/       # Database schema and migrations
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuhirwaVerygood/credit-jambo-client-app.git
   cd credit-jambo-client-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd Frontend
   pnpm install
   
   # Backend
   cd ../Backend
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp Frontend/.env.example Frontend/.env.local
   cp Backend/.env.example Backend/.env
   ```

4. **Database Setup**
   ```bash
   cd Backend
   pnpm prisma:migrate
   pnpm prisma:generate
   ```

5. **Start Development Servers**
   ```bash
   # Backend (Port 3600)
   cd Backend
   pnpm dev
   
   # Frontend (Port 3001)
   cd Frontend
   pnpm dev
   ```

## API Endpoints

- **Authentication**: `/api/auth/*`
- **User Management**: `/api/users/*`
- **Transactions**: `/api/transactions/*`
- **Notifications**: `/api/notifications/*`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.