# Eventra

A full-stack event discovery and ticket booking platform built with Next.js, TypeScript, and PostgreSQL. Users can browse events by categories, artists, and venues, while admins manage events, performers, and venues through a comprehensive dashboard.

## Overview

Eventra is a modern event management platform that connects event organizers with attendees. The platform features event discovery with advanced filtering, secure ticket booking with Razorpay integration, and a complete admin system for managing events, performers, and venues. Built with performance and user experience in mind, it supports responsive design and real-time location-based venue mapping.

**Target Users:**

- Event attendees looking for tickets to concerts, shows, and performances
- Event organizers and venue managers
- Administrators managing platform content

## Features

### User Features

- **Event Discovery**: Browse events by categories, performers, and venues
- **Advanced Filtering**: Filter events by location, date, and category
- **Event Details**: Comprehensive event pages with images, performer info, and venue details
- **Ticket Booking**: Secure checkout with multiple ticket types and quantities
- **Payment Processing**: Integrated Razorpay payment gateway with signature verification
- **User Authentication**: Secure sign-up/sign-in with JWT sessions
- **Profile Management**: User profiles with avatar support

### Admin Features

- **Event Management**: Create and edit events with cover images and descriptions
- **Performer Management**: Add artists/performers with bios and images
- **Venue Management**: Manage venues with address and geolocation data
- **Category Management**: Organize events by categories
- **Ticket Configuration**: Set ticket types, prices, and availability
- **Event Status Control**: Manage event lifecycle (Draft → Published → Completed)

### Technical Features

- **Location Services**: Mapbox integration for venue mapping and location search
- **Image Management**: ImageKit CDN for optimized image uploads and delivery
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Database Transactions**: Atomic operations for booking and payment flows

## Tech Stack

### Frontend

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4.1 with PostCSS
- **UI Components**: Radix UI + Shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **Animations**: Motion library for smooth transitions
- **Icons**: Lucide React & Tabler Icons

### Backend

- **Runtime**: Next.js Server Actions ("use server")
- **Authentication**: Custom JWT implementation with Jose library
- **Password Hashing**: Argon2
- **Middleware**: Route protection and session management

### Database

- **Database**: PostgreSQL 16
- **ORM**: Prisma 7.3.0 with direct PostgreSQL adapter
- **Migrations**: 24+ migration files with comprehensive schema

### Integrations

- **Payments**: Razorpay (Indian payment gateway)
- **Images**: ImageKit (CDN and upload management)
- **Maps**: Mapbox GL for venue mapping and geolocation
- **Location Picker**: Google Maps API alternative

### Development Tools

- **Linting**: ESLint with Prettier and import sorting
- **Git Hooks**: Husky + Lint-staged for pre-commit quality checks
- **Containerization**: Docker Compose for local PostgreSQL
- **Package Manager**: bun
- **Runtime**: Bun.js

## Installation

### Prerequisites

- Bun (JavaScript runtime and package manager)
- Docker and Docker Compose

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/praveenlodhiofficial/eventra.git
   cd eventra
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables (see Environment Variables section below).

4. **Start PostgreSQL database**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   bun run db:migrate
   ```

6. **Generate Prisma client**

   ```bash
   bun run db:generate
   ```

7. **Start development server**

   ```bash
   bun run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5433/eventra

# API endpoints
VERCEL_URL=
NEXT_PUBLIC_API_ENDPOINT=
NEXT_PUBLIC_PROD_API_ENDPOINT=

# Session / Auth
SESSION_SECRET=<random-32-byte-base64-string>
SESSION_EXPIRATION_TIME=7d

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/[account]
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=<public-key>
IMAGEKIT_PRIVATE_KEY=<private-key>

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_SECRET_ID=<secret>
RAZORPAY_WEBHOOK_SECRET=<webhook-secret>

# Email (Resend)
RESEND_API_KEY=<api-key>

# Ngrok (optional)
NGROK_AUTH_TOKEN=<token>

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<token>

# MojoAuth (optional)
MOJOAUTH_CLIENT_ID=
MOJOAUTH_CLIENT_SECRET=
MOJOAUTH_ISSUER=
MOJOAUTH_REDIRECT_URL=
```

## Project Structure

```
eventra/
├── prisma/                    # Database schema & migrations
│   ├── schema.prisma         # Database models and relations
│   └── migrations/           # Migration history (24+ files)
├── public/                    # Static assets
│   ├── icons/                # Application icons
│   └── images/               # Static images
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (user)/          # User-facing pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── modals/         # Form dialogs
│   │   ├── events/         # Event-specific components
│   │   └── upload/         # Image upload components
│   ├── domains/            # Business logic (12 domains)
│   │   ├── auth/           # Authentication logic
│   │   ├── event/          # Event management
│   │   ├── booking/        # Booking system
│   │   ├── payment/        # Payment processing
│   │   └── ...            # Other domain folders
│   ├── lib/                # Utilities and configurations
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global CSS
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── proxy.ts            # Route protection middleware
├── docker-compose.yml      # PostgreSQL container setup
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## API Routes

| Route                       | Method | Purpose                              |
| --------------------------- | ------ | ------------------------------------ |
| `/api/imagekit/upload-auth` | GET    | Generate ImageKit upload credentials |
| `/api/imagekit/delete`      | POST   | Delete image from ImageKit CDN       |

**Note**: The application primarily uses Next.js Server Actions for backend operations rather than traditional REST API routes.

## Usage

### For Users

1. **Browse Events**: Visit the homepage to explore featured events and categories
2. **Find Events**: Use filters to search by location, date, or category
3. **View Details**: Click on events to see performers, venue information, and ticket options
4. **Book Tickets**: Select ticket types and quantities, then proceed to checkout
5. **Complete Payment**: Enter billing details and complete payment via Razorpay
6. **Manage Profile**: Update personal information and view booking history

### For Admins

1. **Access Admin Panel**: Navigate to `/admin` (requires ADMIN role)
2. **Manage Venues**: Create venues with address and geolocation data
3. **Add Performers**: Create performer profiles with images and bios
4. **Create Events**: Set up events with categories, performers, and ticket types
5. **Configure Tickets**: Define ticket prices, quantities, and availability
6. **Publish Events**: Change event status from draft to published

## Future Improvements

Based on the current codebase analysis:

- **Email Notifications**: Implement email confirmations for bookings and account verification
- **Advanced Search**: Add full-text search with PostgreSQL trigram indexes (already partially implemented)
- **Real-time Updates**: WebSocket integration for live event updates and seat availability
- **Mobile App**: React Native companion app for ticket scanning
- **Analytics Dashboard**: Admin analytics for event performance and revenue tracking
- **Multi-language Support**: Internationalization for broader market reach
- **Social Features**: Event sharing, user reviews, and social authentication
- **Advanced Booking**: Seat selection with interactive venue maps

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode and ESLint rules
- Use domain-driven design patterns for new features
- Write comprehensive tests for critical business logic
- Update database migrations for schema changes
- Maintain responsive design principles

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
