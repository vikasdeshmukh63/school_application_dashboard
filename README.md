# School Application Dashboard

A modern school management system built with Next.js, Prisma, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **UI Components**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Calendar**: React Big Calendar
- **Charts**: Recharts
- **Notifications**: React Toastify

## Prerequisites

- Node.js 18+ 
- PostgreSQL
- Docker (optional, for containerized deployment)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd school_management_dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/school_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Prisma Commands

- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma migrate deploy` - Deploy migrations to production
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db seed` - Seed the database
- `npx prisma db push` - Push schema changes to database without migrations

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t school-dashboard .
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

## Project Structure

```
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── [[...sign-in]]/    # Authentication routes
│   │   ├── logout/           # Logout route
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Global styles
│   │   └── favicon.ico       # Site favicon
│   ├── components/           # Reusable components
│   │   ├── forms/           # Form-related components
│   │   ├── Menu.tsx         # Navigation menu
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── Table.tsx        # Reusable table component
│   │   ├── TableSearch.tsx  # Table search functionality
│   │   ├── FormModal.tsx    # Modal for forms
│   │   ├── FormContainer.tsx # Form wrapper component
│   │   ├── InputField.tsx   # Reusable input component
│   │   ├── Pagination.tsx   # Pagination component
│   │   ├── UserCard.tsx     # User profile card
│   │   ├── Announcements.tsx # Announcements component
│   │   ├── BigCalendar.tsx  # Calendar component
│   │   ├── EventList.tsx    # Event listing component
│   │   ├── Performance.tsx  # Performance metrics
│   │   └── Charts/          # Chart components
│   │       ├── FinanceChart.tsx
│   │       ├── CountChart.tsx
│   │       └── AttendanceChart.tsx
│   ├── lib/                 # Utility functions and configurations
│   │   ├── prisma.ts       # Prisma client configuration
│   │   ├── actions.ts      # Server actions
│   │   ├── settings.ts     # Application settings
│   │   └── formValidationSchemas.ts # Form validation schemas
│   ├── utils/              # Helper functions
│   └── middleware.ts       # Next.js middleware
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seed file
├── public/               # Static assets
├── .env                 # Environment variables
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── next.config.mjs      # Next.js configuration
├── docker-compose.yml   # Docker Compose configuration
└── Dockerfile          # Docker configuration
```

## Database Schema

The application includes the following main models:

- **Admin**: System administrators
- **Student**: Student information and records
- **Teacher**: Teacher information and assignments
- **Parent**: Parent information and student associations
- **Grade**: Grade levels
- **Class**: Class information and assignments
- **Subject**: Subject information
- **Lesson**: Class lessons and schedules
- **Exam**: Exam records and results
- **Assignment**: Homework assignments
- **Result**: Student exam and assignment results
- **Attendance**: Student attendance records
- **Event**: School events and activities
- **Announcement**: Class announcements

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is licensed under the MIT License.
