# Expense Tracker

A full-stack expense tracker application with a Node.js backend and vanilla JavaScript frontend.

## Features

- Add new expenses with amount, category, description, and date
- View list of expenses
- Filter expenses by category
- Sort expenses by date (newest first)
- Display total of visible expenses

## Tech Stack

- **Backend**: Node.js, Express, SQLite
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite for persistence

## Design Decisions

- **Database Choice**: SQLite was chosen for its simplicity, file-based storage, and no need for a separate database server. It's suitable for a small application and can handle the required operations efficiently.
- **Idempotency**: Used UUID for expense IDs to ensure that retries of the same request don't create duplicates.
- **Frontend**: Kept simple with vanilla JavaScript to focus on functionality without adding complexity from frameworks.
- **Validation**: Basic client-side and server-side validation for required fields and positive amounts.

## Trade-offs

- No authentication or user management, as it's a personal finance tool for a single user.
- In-memory or file-based persistence; for production, a more robust database might be needed.
- Limited error handling and loading states due to time constraints.
- No automated tests implemented.

## Setup

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open `http://localhost:3000` in your browser

## API

- `POST /expenses`: Create a new expense
- `GET /expenses`: Get list of expenses (optional query params: `category`, `sort=date_desc`)