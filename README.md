# Personal Finance Tracker (WealthFlow)

WealthFlow is a beautiful, highly responsive, production-ready MERN-stack personal finance application. It enables users to securely log earnings and expenses, manage wallets, schedule recurring transactions, configure monthly budget limits, aggregate visual Recharts analytics, and generate detailed printable PDF statements or Excel-compatible CSV spreadsheets.

---

## Technical Architecture & Features

### 1. Frontend Core (React + Vite)
- **Styling**: Tailwind CSS with custom glassmorphism layers and smooth transitions.
- **Charts**: Customized, theme-reactive `Recharts` graphs (Pie chart shares, monthly outflow bars, double-line income comparison, savings trends).
- **Session Auth**: JWT session tokens stored in `localStorage` with automated interceptors that catch expired status errors.
- **Theme Engine**: System-preferred or user-cached class-level Dark/Light toggles.
- **Alert triggers**: Custom warnings created with `react-hot-toast` that check spending caps in real time.

### 2. Backend & DB Core (Node + Express + MongoDB)
- **MVC Architecture**: Models, Routes, Controllers, Services, and Middlewares clearly separated.
- **Authentication**: JWT token generations and secure pre-save password salt hash crypts with `bcryptjs`.
- **Self-Healing Recurring Actions**: Automatic cloning and logging of recurring daily, weekly, and monthly transactions on-demand when users fetch their ledger, eliminating the need for separate background cron tasks.
- **Cascade Deletion**: Deep database delete actions which sweep out a user's transaction logs and budgets when they terminate their profile.

---

## Repository Layout

```text
expense_tracker/
├── package.json                   # Root package (coordinates concurrently dev run)
├── tailwind.config.js             # Tailwind CSS settings
├── vite.config.js                 # Vite proxy details
├── postcss.config.js              # PostCSS config
├── index.html                     # HTML Entry Point
├── src/                           # Frontend React Source
│   ├── main.jsx                   # React Entrypoint
│   ├── index.css                  # Custom design variables & templates
│   ├── layouts/
│   │   └── DashboardLayout.jsx    # Sidebar responsive navigation layout
│   ├── components/
│   │   ├── ProtectedRoute.jsx     # Route authentication guard
│   │   ├── GuestRoute.jsx         # Guest view guard
│   │   ├── StatCard.jsx           # Premium count tiles
│   │   ├── TransactionModal.jsx   # Form modal for transaction CRUD
│   │   ├── BudgetModal.jsx        # Form modal for budget ceilings
│   │   └── ConfirmationModal.jsx  # Security warnings modal
│   ├── pages/
│   │   ├── Login.jsx              # Beautiful gradient sign-in page
│   │   ├── Register.jsx           # User sign-up page
│   │   ├── Dashboard.jsx          # Live financial visual panel
│   │   ├── Transactions.jsx       # Paginated ledger table with filters
│   │   ├── Analytics.jsx          # Deep charts analysis dashboard
│   │   ├── Budgets.jsx            # Monthly spending plans & warnings
│   │   ├── Reports.jsx            # Printable summary generator
│   │   └── Profile.jsx            # User credential management
│   ├── context/
│   │   ├── AuthContext.jsx        # Auth state engine
│   │   ├── TransactionContext.jsx # Transactions CRUD & sync
│   │   ├── BudgetContext.jsx      # Targets & threshold toast notifications
│   │   └── ThemeContext.jsx       # Dark/Light toggle
│   ├── services/
│   │   └── api.js                 # Base Axios helper with interceptors
│   └── utils/
│       ├── formatters.js          # Currency, dates, and icons lookups
│       └── exporters.js           # CSV downloads and print helpers
└── server/                        # Backend Node/Express Server
    ├── package.json               # Backend packages
    ├── server.js                  # Entrypoint Express App
    ├── .env                       # Local environment configurations
    ├── config/
    │   └── db.js                  # Database connection module
    ├── models/
    │   ├── User.js                # User Schema
    │   ├── Transaction.js         # Transaction Schema
    │   └── Budget.js              # Budget Schema
    ├── middleware/
    │   ├── authMiddleware.js      # Protect gate middleware
    │   └── errorMiddleware.js     # Centralized error handler
    ├── controllers/
    │   ├── authController.js      # Auth actions
    │   ├── transactionController.js # Transaction CRUD & metrics
    │   ├── budgetController.js    # Target budgets
    │   └── reportController.js    # Data statement summaries
    └── routes/
        ├── authRoutes.js          # Auth routing
        ├── transactionRoutes.js   # Transactions routing
        ├── budgetRoutes.js        # Budgets routing
        └── reportRoutes.js        # Reports routing
```

---

## Installation & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (version 16 or newer recommended)
- [MongoDB](https://www.mongodb.com/) running locally (port 27017) or a remote MongoDB Atlas database cluster URI.

### Steps to Deploy and Launch

#### 1. Setup Backend Dependencies
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Verify that the local `.env` configuration exists or copy the template:
```bash
# Windows command
copy .env.example .env
```
Ensure your MongoDB database cluster URI (`MONGO_URI`) and a secure signing key string (`JWT_SECRET`) are correctly defined in `server/.env`.

#### 2. Setup Frontend Dependencies
Navigate back to the repository workspace root and install frontend packages:
```bash
cd ..
npm install
```

#### 3. Run in Local Development Mode
From the workspace root directory, start both the React Vite client application (port 3000) and the Node Express server backend (port 5000) concurrently using:
```bash
npm run start
```

This single command coordinates both build processes in a single shell!

#### 4. Access the Application
Open your browser and navigate to:
```text
http://localhost:3000
```
- Click **Create one for free** to register your profile.
- Log in, set a monthly spending budget limit, and begin logging entries!
- Test warnings by adding expenses that consume 80% and 90% of your configured budget capacity.
- Export transaction ledgers to CSV (for Excel) or initiate print commands to generate clean PDF statements.
