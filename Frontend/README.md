# Credit Jambo - Client Frontend

Modern React-based client dashboard for the Credit Jambo platform. Provides users with a comprehensive interface to manage their accounts, view transactions, handle wallet operations, and track devices.

## Features

- **User Authentication**: Secure login and registration
- **Wallet Management**: Deposit and withdraw funds
- **Transaction History**: View detailed transaction records
- **Profile Management**: Update personal information and settings
- **Device Tracking**: Monitor registered devices
- **Notification Center**: Manage notifications and preferences
- **Responsive Design**: Optimized for all device sizes

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (via shadcn/ui)
- **State Management**: React Query (TanStack Query)
- **Authentication**: JWT tokens with HTTP-only cookies
- **Forms**: React Hook Form
- **Icons**: Lucide React

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Client Backend API running (default: http://localhost:3600)

## Installation

1. Navigate to the Client/Frontend directory:
   ```bash
   cd Client/Frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3600/api/v1
   ```

## Development

Start the development server:
```bash
pnpm run dev
```

The application will be available at `http://localhost:3001`

## Production Build

1. Build the application:
   ```bash
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── wallet/        # Wallet management
│   │   ├── transactions/  # Transaction history
│   │   └── settings/      # User settings
│   ├── login/             # Authentication
│   └── register/          # User registration
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── dashboard-*       # Dashboard-specific components
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   ├── providers/        # React context providers
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Key Components

### Authentication Flow
- Login/Register forms with validation
- JWT token management with secure cookies
- Protected routes with middleware
- Automatic token refresh and logout

### Dashboard Layout
- Responsive sidebar navigation
- Header with notifications and profile
- Main content area with breadcrumbs
- Mobile-optimized interface

### Wallet Operations
- Deposit funds with amount selection
- Withdrawal requests
- Balance display and history
- Transaction confirmations

### Transaction Management
- Comprehensive transaction history
- Filtering and search capabilities
- Transaction details and status
- Export functionality

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Client Backend API URL | `http://localhost:3600/api/v1` |

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint for code quality

## API Integration

The frontend communicates with the Client Backend API through:
- RESTful endpoints for all operations
- JWT authentication with Bearer tokens
- Comprehensive error handling
- Loading states and user feedback

## Styling Guidelines

- Tailwind CSS for consistent styling
- Custom color scheme with CSS variables
- Responsive grid and flexbox layouts
- Accessible component design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- Strict TypeScript implementation
- ESLint for code quality enforcement
- Custom hooks for business logic
- Component reusability and composition
