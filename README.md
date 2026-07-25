# AI Chatbot Frontend

This is a modern Next.js React frontend built for an AI Chatbot platform. It contains multiple tailored interfaces including a standard user flow, an Admin portal, and a Super Admin control center. 

The application currently relies on a mocked backend for demonstrations, making it easy for the backend team to clone, understand the routing structure, and swap the mock data sources for real database connections.

---

## 🚀 Quick Start & Installation

1. **Clone the repository** (if you haven't already).
2. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
3. **Install Dependencies**:
   This project uses standard `npm` (or `yarn`/`pnpm`).
   ```bash
   npm install
   ```
4. **Environment Variables**:
   Copy the example environment file and fill in your actual credentials.
   ```bash
   cp .env.example .env.local
   ```
5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be running on `http://localhost:3000`.

---

## 🗺️ Application Routing & Flow

The application is built using Next.js **App Router** (`app/` directory). The routes are broken down by role and functionality.

### Authentication Flow (`app/(auth)`)
- `/login`: The main login page (supports credentials, Google, GitHub).
- `/request-access`: Page for users to request access if they don't have an account.

### User Flow
- `/`: The main application page for a standard authenticated user. Displays the chat interface and sidebars for history.

### Admin Portal (`app/admin`)
- `/admin`: Dashboard showing workspace analytics and chatbot engagement.
- `/admin/users`: User management interface.
- `/admin/conversations`: Logs of chat interactions.
- `/admin/profile`: Admin profile settings.

### Super Admin Portal (`app/superadmin`)
- `/superadmin`: Global platform overview (system health, deployments, global analytics).
- `/superadmin/admins`: Interface to manage system, billing, and support admins.
- `/superadmin/analytics`: Detailed global revenue and interaction charts.
- `/superadmin/models`: AI model configurations and API key management.
- `/superadmin/settings`: Global system settings.
- `/superadmin/profile`: Super Admin profile configuration.

---

## 🔌 Integrating the Real Backend

Currently, the frontend uses "mock" routes and static JSON files to simulate backend responses. The backend team should follow these steps to connect the real database and APIs:

### 1. Removing the Mock API Routes
Inside the `app/api/mock/` directory, you will find simulated endpoints (e.g., `app/api/mock/users/route.ts`, `app/api/mock/chats/route.ts`).
- You can either **replace the contents** of these route handlers to communicate directly with your actual backend services (using standard `fetch` or Axios).
- OR, you can **delete the `mock` folder entirely** and point the frontend components to fetch data from your external backend server URL.

### 2. Updating Component Fetch Requests
If you search the codebase for `fetch('/api/mock/...`, you will see where the frontend components are requesting data. 
- Example in `app/admin/users/page.tsx`:
  ```typescript
  // Currently fetching mock data:
  const res = await fetch('/api/mock/users'); 
  ```
- Change these endpoints to point to your live backend server:
  ```typescript
  // Updated for live backend:
  const res = await fetch('https://api.yourbackend.com/v1/users'); 
  ```

### 3. Data Schema Alignment
The mock endpoints currently pull structural data from the `data/users.json` and `data/chatHistory.json` files.
- Review these JSON files to understand the exact data structures, fields, and types the frontend components expect to receive.
- Ensure your backend endpoints return JSON structures that match these schemas to avoid breaking the UI tables and charts.

### 4. Authentication (NextAuth)
The application is pre-configured to use NextAuth in `app/api/auth/[...nextauth]/route.ts`. 
- To wire up real database authentication, implement a custom credentials provider or connect your database adapter (Prisma, TypeORM, MongoDB) directly inside the NextAuth configuration file.

---

## 🛠️ Backend Developer Guide (Endpoints & Schemas)

To fully replace the mock backend, the backend team needs to implement the following endpoints and adhere to these data schemas.

### Core Data Schemas

**1. User Schema (Applies to Users, Admins, and Superadmins)**
All users share a similar base schema, differentiated by the `role` field.
```typescript
interface User {
  id: string; // Unique identifier (e.g., UUID or MongoDB ObjectId)
  name: string;
  email: string;
  password?: string; // Hashed password (never returned to frontend)
  role: 'user' | 'admin' | 'superadmin';
  apiLimit: number; // Max allowed tokens/API usage
  tokensUsed: number; // Tokens consumed so far
  apiUsed: number; // Alternate usage metric (optional)
  createdAt: string; // ISO 8601 Date String
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string; // ISO 8601 Date String
  avatar?: string; // Base64 string or URL to profile picture
}
```

**2. Chat Session Schema**
```typescript
interface ChatSession {
  id: string;
  title: string;
  lastUpdated: string; // ISO 8601 Date String
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601 Date String
}
```

**3. Access Request Schema**
```typescript
interface AccessRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  useCase: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // ISO 8601 Date String
}
```

### Endpoints to Implement

The frontend expects the following RESTful endpoints. Update the base URL in the frontend services (`frontend/services/*.ts`) to point to your live server.

#### 🙎‍♂️ User Endpoints (User Dashboard)
- **`GET /api/user/profile`** - Fetch the logged-in user's profile details.
- **`PUT /api/user/profile`** - Update profile details (name, password) and Avatar (handles `multipart/form-data`).
- **`GET /api/user/billing`** - Fetch usage analytics (Assigned Model, Tokens Used, and 7-Day daily usage history array).
- **`GET /api/chats`** - Fetch all chat sessions for the logged-in user.
- **`POST /api/chats`** - Create a new chat session or append a message to an existing session.

#### 🛡️ Admin Endpoints (Admin Portal)
- **`GET /api/admin/users`** - Fetch all users managed by the Admin.
- **`POST /api/admin/users`** - Create a new user (assigns credentials and API limits).
- **`PUT /api/admin/users`** - Update an existing user's details or limits.
- **`DELETE /api/admin/users`** - Delete or suspend a user.
- **`GET /api/admin/requests`** - Fetch all pending access requests.
- **`PUT /api/admin/requests`** - Approve or reject an access request.

#### 👑 Super Admin Endpoints (Global Control)
- **`GET /api/users`** - Fetch ALL users across the entire platform.
- **`POST /api/users`** - Create a global user/admin.
- **`DELETE /api/users`** - Delete a global user.

### Important Notes for Backend Developers:
1. **Avatar Uploads:** The `PUT /api/user/profile` endpoint on the frontend sends `multipart/form-data` with a `File` object when the user changes their avatar. The backend must handle file parsing (e.g., using Multer in Node.js or FastAPI UploadFile) and store the image securely (e.g., AWS S3).
2. **NextAuth:** The `app/api/auth/[...nextauth]/route.ts` file is currently configured to authenticate against the mock `data/users.json`. You must update the `authorize` function in this file to query your real database and verify the hashed passwords.
3. **Usage Analytics:** The system uses a Managed B2B Model. Users do not pay directly; instead, Admins assign models and API limits. The `GET /api/user/billing` endpoint must return an `assignedModel` string and a `dailyUsage` array for the Recharts graph to render properly.
