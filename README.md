# Finance Dashboard 

## Overview of Approach

This application focuses on both maximum aesthetic quality and extremely robust formatting functionality:
- **Resilient UI Architecture**: Context-driven dynamic state handles filtering, sorting, and seamless addition of elements safely using strict functional state updates (eliminating React closure bugs).
- **Offline First & Optimistic Dual-Storage System**: The UI writes to `localStorage` immediately so user actions are *never* blocked by network latency. It then silently synchronizes the data with the remote `Supabase` database in the background, updating the UI once the backend confirms the sync.
- **Extensive Typography Controls**: Custom `CurrencyDisplay` functionality separates currency signs from digits anatomically instead of using text strings to prevent UI overlap across *any* typography scale or platform font limitation.

## Tech Stack

* **Frontend**: React (v18), TypeScript, Vite
* **Styling**: Tailwind CSS + Custom CSS Variables (`index.css`)
* **Components & Icons**: Lucide React for crisp, lightweight iconography
* **Data Visualization**: Recharts (fully customized with dynamic CSS variable tooltips and axis ticks)
* **Backend / Storage**: 
  * `localStorage` (Browser Persistence)
  * Supabase (PostgreSQL Database as a Service)

## Features

- **Adding Transactions**: An intelligent interface that validates date, numeric amounts, categories, and handles dual-storage state merging.
- **Role-Based View**: Toggle between *Viewer* (read-only) and *Admin* roles. Administrative actions (Edit, Add, Delete) dynamically hide from Unauthorized users. 
- **Dark / Light Modes**: A fully decoupled CSS Variable structure ensuring dark mode remains "Premium Gold/Brown" while light mode adopts pastels and darkened accents without modifying React component logic.
- **Advanced Filtering & Sorting**: Clean logic to search by substring, filter categorically or by type, and accurately toggle sorts on numerical amounts and UTC timelines.
- **Currency Typography Separation**: Explicit structural DOM separation guarantees that the Rupees Symbol (`₹`) and amounts gracefully expand natively across screen breakpoints without ever clipping or collapsing into each other.
- **Personalized Header**: Editable Avatar/User Profile header with persisting name saving.

## Setup Instructions

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v16.0.0+ recommended).

### 2. Install Project Dependencies
Run the following in the project directory:
```bash
npm install
```

### 3. Environment Variables (Backend)
To fully utilize remote synchronization, create a `.env` file at the root of the project with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
*(Note: If the Supabase URL/Key are omitted or invalid, the app gracefully degrades to run entirely across local browser storage!)*

### 4. Start the Application
To run the local development server:
```bash
npm run dev
```

### 5. Build for Production
To securely map and bundle the React project for static deployment:
```bash
npm run build
```
