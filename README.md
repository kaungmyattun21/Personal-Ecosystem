# Personal Ecosystem

A comprehensive personal management system designed to centralize and streamline various aspects of daily life, including finance, health, and kitchen management.

## 🚀 Overview

Personal Ecosystem is a full-stack monorepo application built with modern technologies to provide a seamless user experience for managing personal data.

### Project Structure

- **`/frontend-app`**: A modern web application built with Next.js, featuring a responsive dashboard and interactive modules.
- **`/backend`**: A robust Express-based API server handling business logic, data persistence, and authentication.

## ✨ Features

- **Finance Management**: Track budgets, expenses, and savings goals.
- **Health Tracking**: Manage health-related data and metrics.
- **Kitchen & Pantry**: Organize recipes and inventory management.
- **Authentication**: Secure user sessions using JWT and bcrypt.
- **Data Visualization**: Interactive charts and dashboards using Recharts.
- **Responsive Design**: Fully optimized for various screen sizes with Tailwind CSS.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### Testing

- **Unit Testing**: [Vitest](https://vitest.dev/)

## 🏛️ Architectural Design

The project follows a **Modular, Feature-Based Architecture** designed for scalability, maintainability, and clear separation of concerns.

### 🧩 Feature-Based Structure

Both frontend and backend are organized into domain-specific modules (e.g., Finance, Auth, User). This allows for:

- **Encapsulation**: All logic related to a specific feature (components, hooks, services, schemas, types) lives within its own directory.
- **Easy Discovery**: Navigating the codebase is intuitive as functionality is grouped by business domain.
- **Scalability**: New features can be added in isolation without cluttering global directories.

### 🧹 Clean Code & Design Patterns

- **Service-Repository Pattern (Backend)**: Separate request handling (Controllers), business logic (Services), and data access (Repositories) to ensure a high level of testability and separation of concerns.
- **Schema-Driven Validation**: Using **Zod** for both frontend form validation and backend request parsing, ensuring data integrity across the stack.
- **Modular Redux Slices**: State management is divided into logical slices that correspond to the feature modules.
- **Domain Logic Separation**: Business rules are kept separate from framework-specific code, making the core logic easier to test and migrate if needed.
- **SOLID Principles**: Focused application of SOLID principles, specifically **Single Responsibility** (ensuring each class/function has one job) and **Dependency Inversion** (using repositories to decouple services from the database implementation).

### 🏢 Directory Breakdown

- **`backend/src/modules`**: Contains the core business logic, divided by domain.
- **`frontend-app/src/features`**: Houses feature-specific UI components, hooks, and state logic.
- **`shared` / `lib`**: Centralized locations for reusable utilities, types, and cross-cutting concerns.

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or pnpm
- PostgreSQL instance

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd PersonalEcosystem
   ```

2. **Setup Backend**:

   ```bash
   cd backend
   npm install
   cp .env.example .env # Update with your database credentials
   npm run db:generate
   npm run db:push
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local # Update if necessary
   ```

### Running the Application

Open two terminals:

**Terminal 1 (Backend)**:

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**:

```bash
cd frontend-app
npm run dev
```

The application will be available at `http://localhost:3000`, and the backend API at `http://localhost:4000` (default).

## 🧪 Testing

Both frontend and backend use Vitest for testing.

- **Backend**: `cd backend && npm test`
- **Frontend**: `cd frontend-app && npm test`

## 📝 License

This project is private and for personal use.
