
# OptiTrade

OptiTrade is a modern, data-driven stock trading application built with Next.js, TypeScript, and Tailwind CSS. It provides users with a comprehensive suite of tools for tracking and analyzing the stock market, managing their portfolio, and making informed trading decisions.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dashboard:** A comprehensive overview of the user's portfolio, including total value, profit and loss, and overall return. It also features an AI-powered portfolio tip for diversification.
- **Portfolio Management:** Users can track their stock holdings, view their performance, and manage their portfolio.
- **Stock Trading:** A seamless interface for buying and selling stocks.
- **Stock Screener:** A powerful tool for filtering and finding stocks based on various criteria.
- **News:** A dedicated section for the latest financial news to keep users informed.
- **Watchlist:** Users can create and manage a watchlist of stocks they are interested in.
- **User Authentication:** Secure user authentication with JWT, including login, signup, and password reset functionality.
- **Responsive Design:** A fully responsive user interface that works on all devices.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (or npm/yarn)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/optitrade3.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd optitrade3
    ```
3.  Install the dependencies:
    ```bash
    pnpm install
    ```

## Running the Application

To run the application in development mode, use the following command:

```bash
pnpm dev
```

This will start the development server at `http://localhost:3000`.

To build the application for production, use the following command:

```bash
pnpm build
```

To start the production server, use the following command:

```bash
pnpm start
```

## Project Structure

The project follows a standard Next.js App Router structure.

```
optitrade3/
├── app/
│   ├── (public)/       # Public routes (login, signup, etc.)
│   ├── (app)/          # Authenticated routes (dashboard, etc.)
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts for state management
│   ├── services/       # API services
│   └── ...
├── components/         # Shared UI components
├── config/             # API endpoints configuration
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
└── ...
```

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [React Context](https://reactjs.org/docs/context.html)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Data Fetching:** [Axios](https://axios-http.com/), [TanStack Query](https://tanstack.com/query/v5)
- **Charting:** [Recharts](https://recharts.org/)
- **Authentication:** [JWT](https://jwt.io/)

## API Endpoints

The application interacts with a backend API for user authentication and data retrieval. The API endpoints are defined in `config/apiEndpoints.ts`.

- `POST /api/login`: User login
- `POST /api/signup`: User registration
- `POST /api/verify-otp`: Verify OTP for new user registration
- `POST /api/forgot-password`: Request password reset
- `POST /api/verify-reset-otp`: Verify OTP for password reset
- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get a specific user by ID

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.
