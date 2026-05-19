# Mampu — Frontend Engineer Take Home Test

A responsive Next.js app that displays users with aggregated posts/todos, search, sort, filters, pagination, and detail pages.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **SWR** for client data fetching
- **Tailwind CSS v4** for styling
- **Jest** + **React Testing Library** for unit tests

## Quick Start

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # 56 tests
npm run build     # production build
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Welcome page with portfolio link and navigation to users |
| `/users` | Users list with search, sort, filters, pagination (5/page) |
| `/users/[id]` | User detail with info card, posts, and todos |

## Features

**Users List**
- Fetches users, posts, and todos from JSONPlaceholder
- Table on desktop, cards on mobile
- Search by name or email
- Sort by name (asc/desc) or pending todos count
- Filter: show only users with pending todos
- Column widths are fixed via `table-fixed` + `colgroup` to prevent layout shift
- Pagination with URL-synced query params (search state preserved on back navigation)

**User Detail**
- Card with name, username, email, phone, website, company, address
- Posts section with show-all/show-less toggle (>5 posts)
- Todos section with completion indicators and show-all toggle
- Back button uses `router.back()` with fallback to `/users`

**Styling**
- IBM Plex Sans (body/display) + IBM Plex Mono (labels)
- Design system: primary `#0F2A3B`, tertiary `#0E9F8E`, neutral `#F1F5F7`
- Single accent rule — only tertiary drives interactions
- No dark mode, high contrast throughout

**States Covered**
- Loading skeletons for table, cards, and detail page
- Error states with retry guidance
- Empty state with Lottie ghost animation when filters return no results
- Invalid user ID → "User not found" page
- Long content truncated via `truncate` utility

## Tests

```
__tests__/
├── UsersClient.test.tsx        # List: render, filter, sort, pagination, skeleton
├── UserDetailClient.test.tsx    # Detail: render, posts/todos, show-all toggle, skeleton
├── app/page.test.tsx            # Welcome page content
├── hooks/useUsers.test.ts       # useUsers hook
├── hooks/useUserDetail.test.ts  # useUserDetail hook (including invalid id)
├── lib/fetcher.test.ts          # API fetcher utilities
└── components/ErrorBoundary.test.tsx
```

All network calls are mocked via `jest.mock("swr")`.

## Bonus

- Client-side pagination (5 per page)
- Error Boundary wrapping the detail route
- URL query param sync for filter/sort/page state
