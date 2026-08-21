# SprintDesk Architecture Document

This document outlines the system architecture, core components, technology stack, and data flow of the SprintDesk application.

## 1. System Architecture

SprintDesk is a Single Page Application (SPA) built using a decoupled, layered architecture. The application enforces a strict separation of concerns between the UI presentation, application state, and data fetching layers. 

The architecture is divided into three primary layers:
1. **UI Layer (Presentation):** React components responsible solely for rendering data and capturing user interactions. 
2. **State Layer (Logic):** A hybrid state management system utilizing Zustand for synchronous client-state and TanStack Query for asynchronous server-state.
3. **API Layer (Data Access):** A centralized service layer that isolates network requests and mock data ingestion from the UI.

## 2. Core Technologies

- **Core Framework:** React 18 (TypeScript) + Vite
- **Styling:** Tailwind CSS v3 (Custom design system, no external UI component libraries)
- **Client State Management:** Zustand (with `persist` middleware for `localStorage`)
- **Server State Management:** TanStack Query v5 (React Query)
- **Routing:** React Router v6 (with `React.lazy` route-level code splitting)
- **Drag & Drop:** `@dnd-kit/core`
- **Data Visualization:** Recharts
- **Testing Engine:** Vitest + React Testing Library + Playwright
- **Accessibility:** `@axe-core/react`

## 3. Component Structure

The application is modularized to promote reusability and maintainability:

- **`/src/components/ui`**: Contains the foundational, highly reusable generic UI components (Button, Input, Select, Modal, Toast, DataTable, Skeleton, Icons). These act as the internal Design System.
- **`/src/components/board`**: Contains feature-specific components for the Kanban board (Column, TaskCard, TaskDrawer, TaskModal).
- **`/src/pages`**: Contains the root route components (Login, Dashboard, Board, Analytics) which are lazy-loaded by the router.
- **`/src/store`**: Contains the localized Zustand stores (`useAuthStore`, `useBoardStore`, `useNotificationStore`, `useThemeStore`).
- **`/src/api`**: Centralizes API communication (`auth.ts`, `board.ts`, `axios.ts`).

## 4. State Management Discipline

The application strictly divides state into three distinct categories to prevent prop-drilling and redundant data caching:

1. **Local Component State (`useState`)**: Used for ephemeral UI state such as form inputs, modal toggles, and filter dropdown selections.
2. **Global Client State (Zustand)**: Used for synchronous, application-wide state. 
   - `useBoardStore`: Manages the highly interactive drag-and-drop state of the Kanban board, including an `Undo` history stack.
   - `useAuthStore`: Manages the in-memory access token and persistent refresh token.
   - `useNotificationStore`: Manages the client-side UI state of notifications (read/unread).
3. **Server State (TanStack Query)**: Used exclusively for asynchronous API data that requires caching, polling, or background synchronization. 
   - E.g., The Notification Bell utilizes `useQuery` to poll JSONPlaceholder every 15 seconds, automatically pausing when the browser tab loses visibility.

## 5. Data Flow & API Abstraction

To ensure the application can easily migrate from the current mock data to a live production backend, the UI is entirely decoupled from the raw data source.

**Data Flow Sequence:**
1. A user interacts with a UI component (e.g., loading the Board).
2. The UI component invokes a method on the State Hook (`useBoardStore`).
3. The State Hook calls a function in the API Layer (`src/api/board.ts`).
4. The API Layer simulates a network request, fetches the data from the Data Source (`mock-data.json`), and returns the typed payload.
5. The State Hook updates, triggering a reactive re-render in the UI Component.

By utilizing this abstraction, replacing `mock-data.json` with a real backend API requires altering exactly one line of code in the `src/api` layer, without modifying any React UI components.
