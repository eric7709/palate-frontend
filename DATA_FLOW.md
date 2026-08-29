# Palate Frontend Data Flow

## Overview

This project is a Next.js frontend that uses a hybrid data model:

- Zustand for local UI/session state
- React Query for backend data caching and invalidation
- Axios as the shared API gateway
- WebSockets (STOMP + SockJS) for live order updates

The general pattern is:

UI -> Zustand store or React Query hook -> shared API client -> backend -> response -> cache/UI refresh

---

## 1) Application startup and global provider

The app boots from the root layout in [app/layout.tsx](app/layout.tsx).

That layout wraps all pages in the provider from [src/shared/provider/Provider.tsx](src/shared/provider/Provider.tsx).

The provider sets up:

- a single React Query client
- default cache behavior
- Devtools for query inspection

This is the global source of server-state management across the app.

---

## 2) Authentication flow

The auth state lives in [src/auth/store.ts](src/auth/store.ts).

It uses Zustand with persistence, so the app stores:

- user
- accessToken
- refreshToken
- isAuthenticated

These values are saved in browser storage and restored on reload.

### Request/response handling

All backend requests pass through the shared Axios instance in [src/shared/utils/api.ts](src/shared/utils/api.ts).

That file does 3 important things:

1. Creates a configured axios client with the API base URL.
2. Adds an Authorization header automatically for protected routes.
3. Handles JWT refresh logic on 401 responses.

### Public routes

The app explicitly excludes many endpoints from auth enforcement, such as:

- /auth/login
- /auth/refresh
- /auth/register
- guest order creation
- QR lookup for room/table access

### Refresh flow

When a request fails with 401:

- the interceptor checks if it is a public route
- if not public, it attempts to refresh the access token using the refresh token
- if refresh succeeds, it retries the original request
- if refresh fails, it clears auth and redirects to /auth/login

That means the app keeps sessions alive without manual user intervention.

---

## 3) Shared API pattern

Most feature modules follow a common structure:

- query hooks using React Query
- mutation hooks for create/update/delete
- cache invalidation on success

The generic query helper is in [src/shared/utils/hook.ts](src/shared/utils/hook.ts).

It wraps useQuery and calls the shared axios client with:

- queryKey
- URL
- enabled flag
- optional axios config such as params

This is the base pattern for fetching paginated lists, single records, and filtered data.

---

## 4) Local UI state vs backend state

### Backend/server state

These are managed by React Query and cached centrally:

- rooms
- tables
- menu items
- categories
- orders
- analytics summaries

Examples:

- [src/room/hooks/hooks.api.ts](src/room/hooks/hooks.api.ts)
- [src/orders/hooks/hooks.api.ts](src/orders/hooks/hooks.api.ts)
- [src/categories/hooks/hooks.api.ts](src/categories/hooks/hooks.api.ts)

### Local/client state

These are managed by Zustand and usually live in the browser only:

- auth session: [src/auth/store.ts](src/auth/store.ts)
- order draft: [src/orders/store/index.request.ts](src/orders/store/index.request.ts)
- selected customer: [src/customers/store.ts](src/customers/store.ts)
- order filters: [src/orders/store/index.ts](src/orders/store/index.ts)

This separation is intentional: draft orders and user session data are often updated before the backend confirms them.

---

## 5) Order creation workflow

The order flow is the best example of how data moves end-to-end.

### Step 1: customer context

The selected customer is managed in [src/customers/store.ts](src/customers/store.ts).

It stores customer identity in localStorage so the customer can persist across the checkout flow.

The app hydrates that store in [src/shared/provider/AppProvider.tsx](src/shared/provider/AppProvider.tsx).

### Step 2: order draft state

The in-progress order is managed in [src/orders/store/index.request.ts](src/orders/store/index.request.ts).

This store contains:

- items
- quantity
- orderStatus
- tableId / roomId / cashierId / waiterId
- note
- unavailableItems
- modal state

This is a client-only draft before the order is created on the backend.

### Step 3: menu item selection

When a user adds or updates menu items, the Zustand store updates the draft order object immediately.

No backend call happens yet.

### Step 4: submission

When the user confirms the order, the mutation in [src/orders/hooks/hooks.api.ts](src/orders/hooks/hooks.api.ts) sends:

- POST /orders

with an `OrderRequestDTO` payload.

### Step 5: server response and invalidation

On success:

- the response is returned to the mutation
- React Query invalidates the order-related queries
- the UI refreshes automatically from the updated backend state

This keeps the app synchronized without requiring full page reloads.

---

## 6) QR-based room and table ordering flow

This app supports guest ordering through QR URLs.

### Room QR flow

[app/room-order/[token]/page.tsx](app/room-order/[token]/page.tsx):

- accepts a token from the URL
- calls `getRoom(token)` from [src/room/utils/index.ts](src/room/utils/index.ts)
- fetches data from `${BACKEND_URL}/rooms/qrcode/${token}`
- if valid, it renders the room ordering experience

### Table QR flow

[app/table-order/[token]/page.tsx](app/table-order/[token]/page.tsx):

- accepts a URL token
- calls `getTable(token)` from [src/tables/services.ts](src/tables/services.ts)
- fetches data from `${BACKEND_URL}/tables/qrcode/${token}`
- checks the table availability and required staff assignments
- allows ordering if the table is available

This flow is a special public-access path: guests can resolve their room/table context from the backend before authentication.

---

## 7) Real-time order updates

The project listens for live backend events through STOMP in [src/shared/hooks/useOrderRealTime.ts](src/shared/hooks/useOrderRealTime.ts).

It subscribes to:

- /topic/orders/created
- /topic/orders/updated

When the backend emits an event:

- React Query invalidates order and analytics queries
- toast notifications are displayed based on status changes
- the UI reflects live status transitions like PREPARING, COMPLETED, PAID, CANCELLED

This is how order status in the UI stays current without polling aggressively.

---

## 8) Room and table data flow

The feature hooks for room and table management are in:

- [src/room/hooks/hooks.api.ts](src/room/hooks/hooks.api.ts)
- [src/tables/hooks/hooks.api.ts](src/tables/hooks/hooks.api.ts)

These functions do the usual pattern:

- query for list/single resource
- mutation for create/update/delete
- invalidate relevant query keys on success

The UI then reads the data from React Query cache and renders list/detail screens accordingly.

---

## 9) Workflow summary

The system can be summarized in one pipeline:

1. User logs in or accesses a QR table/room.
2. Auth/session data is stored in Zustand persist store.
3. Feature-specific React Query hooks fetch backend data.
4. The shared Axios client attaches tokens and handles refresh automatically.
5. User actions update local Zustand draft state.
6. Mutations send changes to backend.
7. React Query invalidates affected data.
8. WebSockets push live updates.
9. The UI re-renders from the refreshed cache.

---

## 10) Short conclusion

This project uses a classic full-stack front-end pattern:

- local transient state in Zustand for user actions and draft data
- shared network layer in Axios for backend communication and JWT refresh
- React Query as the app’s server-state cache and synchronization layer
- WebSockets for live operational updates

The backbone of the whole system is the interaction between Zustand draft state and React Query-backed backend data, with the shared Axios client acting as the central gateway.
