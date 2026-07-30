<div align="center">
  <h1>🤖 AI Chatbot Frontend</h1>
  <p><i>A centralized, role-based platform for managing conversational AI interactions and usage analytics.</i></p>
  
  <br />

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
</div>

---

## ✨ Overview
The **AI Chatbot Frontend** is a modern, responsive web application designed to manage AI chat sessions, user access, and API token usage. Built with Next.js, it features distinct dashboards for Users, Admins, and Superadmins, offering comprehensive analytics and role-based access control out of the box.

## 🛠️ Tech Stack & Technologies

### 💻 Frontend
* **Next.js 16 (App Router):** Server-side rendering and static site generation for optimized performance.
* **React 19:** Modern UI components and hooks.
* **TypeScript:** Strictly typed codebase for fewer runtime errors.
* **TailwindCSS 4:** Modern, utility-first responsive styling.
* **Redux Toolkit:** Predictable global state management.
* **Chart.js & Recharts:** Dynamic, interactive usage analytics and billing charts.
* **NextAuth:** Secure authentication flows and session management.

---

## 👥 User Roles & Permissions

| Role | Responsibilities |
| :--- | :--- |
| 🧑 **User** | Interact with the AI chatbot, view personal chat history, update profile and avatar, and track personal API/token usage. |
| 🧐 **Admin** | Manage users, approve or reject access requests, assign models, and define API usage limits for users. |
| 👑 **Superadmin** | God-mode. Manage all users and admins globally across the entire platform. |

---

## 🔄 Application Flow

1. **Authentication:** Users log in securely via NextAuth credentials.
2. **Chatting:** Users create new chat sessions or resume past interactions with the AI assistant.
3. **Analytics:** Users can monitor their token consumption and assigned AI model in the Billing dashboard.
4. **Administration:** Admins log in to review pending access requests, provision new accounts, and monitor usage across their organization.
5. **Global Control:** Superadmins oversee the entire system, managing all roles and platform-wide configurations.

---

## 📂 Folder Structure

```text
📦 ai-chatbot-frontend
 ┣ 📂 app
 ┃ ┣ 📂 admin           # Admin Dashboard routes (users, requests, api-usage)
 ┃ ┣ 📂 api             # Next.js API Routes (auth, mock endpoints)
 ┃ ┗ 📜 layout.tsx      # Root layout
 ┣ 📂 components        # Reusable UI components (tables, charts, inputs)
 ┣ 📂 data              # Mock data JSON files (users, chatHistory)
 ┣ 📂 public            # Static assets and images
 ┣ 📂 services          # API client services (fetch wrappers)
 ┣ 📂 store             # Redux slices and store configuration
 ┣ 📜 .env.local        # Environment variable template
 ┣ 📜 package.json      # Dependencies and scripts
 ┗ 📜 next.config.ts    # Next.js bundler configuration
```

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/ai-chatbot-frontend.git
cd ai-chatbot-frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables
Create a `.env.local` file in the root directory and add your NextAuth configuration:
```env
NEXTAUTH_SECRET=your_super_secret_jwt_key
NEXTAUTH_URL=http://localhost:3000
```

### 4️⃣ Start the Development Server
```bash
npm run dev
```
The frontend will boot up at `http://localhost:3000`.

---

## 📡 API Reference Summary

The application currently uses mock route handlers (`/api/mock/...`) configured to communicate with local JSON files for demonstration purposes. These should be swapped to your live backend URL.

* 🔐 **Auth:** `/api/auth/[...nextauth]`
* 🙎‍♂️ **User:** `/api/mock/user/profile`, `/api/mock/user/billing`, `/api/mock/chats`
* 🛡️ **Admin:** `/api/mock/admin/users`, `/api/mock/admin/requests`
* 👑 **Super Admin:** `/api/mock/users`

---
<div align="center">
  <i>Built with ❤️ for intelligent conversations.</i>
</div>
