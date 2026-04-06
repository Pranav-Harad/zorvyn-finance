# Zorvyn Finance Dashboard

## Project Overview
Zorvyn Finance is a modern, high-performance financial dashboard designed to provide users with a clear and actionable view of their personal or business finances. The application features a sleek Slate & Amber aesthetic and focuses on data visualization, transaction management, and automated tracking insights, all operating seamlessly within the client browser.

## Tech Stack
- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Charting:** Recharts
- **Animations:** Framer Motion
- **Date Handling:** date-fns
- **UI Components:** Radix UI / shadcn

## Local Setup

To run this project locally, clone the repository and execute the following commands in your terminal:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Dashboard Overview:** A centralized hub providing a high-level summary of your financial health. It includes sparkline metrics for Total Balance, Income, and Expenses, an interactive Balance Trend area chart with dynamic annotations, and a categorized Spending Breakdown donut chart.
- **Transactions Management:** A robust data table allowing users to view their financial history. Features include real-time text search, type-based pill filtering (All, Income, Expense), and chronological sorting capabilities.
- **Role-Based UI:** The application implements a simulated role-based access control system to demonstrate authorization workflow patterns.
  - **Viewer Mode:** The default, read-only state. Users can navigate the dashboard, view charts, and utilize transaction filters, but cannot modify the underlying data structures.
  - **Admin Mode:** Grants full administrative privileges. Admins gain access to inline editing capabilities and deletion controls directly within the Transactions table, as well as the UI capacity to log new entries.
  - *Note: To test this functionality, use the toggle icon located at the bottom of the navigation sidebar.*
- **AI Insights:** An analytical view that extrapolates raw data to provide deeper financial context. This includes active savings rate calculations, projected end-of-month balance forecasting, segmented spending velocity comparisons, and a ranked leaderboard of top recurring merchants.

## State Management

The application utilizes **Zustand** for global state management. 

- **What state exists:** The global store holds the core `transactions` array and the currently active simulated user `role` (Admin or Viewer). Local component state (via React `useState`) is reserved strictly for UI-specific transient data, such as search input strings, active filter pills, view sorting, and active inline edit forms.
- **Where it lives:** The global state is centralized in `src/store/useStore.ts`, purposefully keeping core business logic decoupled from the rendering components.
- **Why this approach:** Zustand was chosen over the native Context API or Redux for its minimalistic, boilerplate-free API. It provides high-performance, predictable state updates without requiring complex provider wrappers, which perfectly suits the lightweight architectural needs of this dashboard.

## Known Limitations
- **Mock Data Context:** The application is currently a frontend prototype. All financial metrics, transactions, and insights are generated from a static local `mockData.ts` file rather than a live API.
- **No Backend Persistence:** There is no persistent database architecture. Any transactions added, edited, or deleted during an active Admin session will operate cleanly in state, but will revert to default upon a hard page browser refresh.
