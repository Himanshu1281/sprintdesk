# SprintDesk

SprintDesk is a production-ready Kanban sprint dashboard built as part of a technical assignment. It features an interactive drag-and-drop board, data visualization, real-time simulated notifications, and a completely custom, accessible UI component library built from scratch with Tailwind CSS.

## Features

- **Authentication System:** Integrated with DummyJSON. Implements secure token handling by keeping the access token in memory (Zustand) and the refresh token in `localStorage`. An Axios interceptor silently handles 401 Unauthorized errors to automatically refresh the session.
- **Interactive Kanban Board:** Built with `@dnd-kit/core`. Users can seamlessly drag and drop tasks across columns (Backlog, In Progress, Review, Done). Includes a side-drawer for editing task details and a modal for creating new ones.
- **Analytics Dashboard:** Visualizes sprint data using `recharts`. Includes Sprint Velocity (Bar), Task Status Distribution (Pie), Priority Breakdown (Bar), and Completion Trend (Line) charts.
- **Custom UI Library:** A lightweight design system created purely with native HTML elements and Tailwind CSS v3 (no external UI libraries like Material UI or Radix). Fully accessible and supports Light/Dark mode via CSS variables.
- **Notification System:** Simulates real-time updates by polling the JSONPlaceholder API. Polling automatically pauses when the browser tab is hidden to save resources. Unread notifications trigger in-app toast alerts.
- **Performance & Testing:** Implements route-level code splitting using `React.lazy` and `Suspense`. Fully unit-tested with Vitest and React Testing Library.

## Tech Stack

- **Framework:** React 18 (TypeScript) + Vite
- **Styling:** Tailwind CSS v3
- **State Management:** Zustand
- **Routing:** React Router v6
- **Data Fetching/Polling:** TanStack Query (React Query) + Axios
- **Drag & Drop:** `@dnd-kit/core`
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

> **Note on Environment Variables**: This application consumes public, open-source APIs (DummyJSON, JSONPlaceholder) and a local mock JSON database. Therefore, no `.env` files or secure API keys are required to run this project locally.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd SprintDesk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run unit tests:
   ```bash
   npm run test
   ```

### Default Credentials
To access the dashboard, you can use the default DummyJSON credentials:
- **Username:** `emilys`
- **Password:** `emilyspass`

## Assumptions and Limitations

### Assumptions
- **Modern Browsers:** The application assumes usage on a modern web browser that fully supports CSS variables and ES6+ JavaScript features.
- **External API Reliance:** It relies on an active internet connection to interact with the DummyJSON (Authentication) and JSONPlaceholder (Notifications) APIs. It assumes these services remain available and maintain their current data structures.
- **Local State Management:** For the purpose of this demonstration, Kanban board data and task states are managed locally rather than persisting to a remote database.

### Limitations
- **Mock Backends & Rate Limits:** Because the app utilizes public mock APIs, it is subject to their performance, rate limits, and uptime.
- **Simulated Real-time Features:** Notifications are simulated via short polling instead of WebSockets. While functional for demonstration and optimized to pause when the tab is hidden, it is not the optimal approach for a true real-time, high-traffic production application.
- **Data Persistence:** Changes made to the Kanban board, such as creating new tasks or moving existing ones, are stored locally and will reset or be lost depending on the exact local state mechanism used (e.g., page refresh or cache clearing), as there is no real persistent backend database attached.
