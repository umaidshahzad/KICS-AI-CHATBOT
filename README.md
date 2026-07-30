<div align="center">
  <h1>🎓 University Admissions Portal</h1>
  <p><i>A centralized, role-based platform for streamlining university admissions.</i></p>
  
  <a href="https://admission-portal-mjey.onrender.com/"><strong>🚀 View Live Deployment</strong></a>
  
  <br />
  <br />

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
</div>

---

## ✨ Overview
The **University Admissions Portal** is a full-stack monolithic web application designed to handle the entire student admission lifecycle. From student registration and document uploads to administrator reviews and automated merit list generation, this platform connects applicants with university staff seamlessly.

## 🛠️ Tech Stack & Technologies

### 💻 Frontend
* **React 19 & Vite 6:** Lightning-fast UI rendering and compilation.
* **TypeScript:** Strictly typed codebase for fewer runtime errors.
* **TailwindCSS 4:** Modern, utility-first responsive styling.
* **Framer Motion / Motion:** Smooth micro-animations and page transitions.
* **Lucide React:** Clean and scalable SVG icons.
* **React Context API:** Lightweight, prop-drilling-free global state management.

### ⚙️ Backend
* **Node.js & Express.js:** Robust server routing and request handling.
* **Monolithic Vite Middleware:** Vite runs directly within Express during development to completely eliminate CORS issues.
* **MongoDB Atlas & Mongoose 9:** Cloud NoSQL database with rigid schema validation.
* **JWT & bcryptjs:** Secure authentication flows and password hashing.
* **Multer (MemoryStorage):** Efficient handling of `multipart/form-data` for transcripts and proposals.

---

## 👥 User Roles & Permissions

| Role | Responsibilities |
| :--- | :--- |
| 🧑🎓 **Applicant** | Register, browse programs, submit applications (with transcripts/documents), and track admission status. |
| 🧐 **Admissions Officer** | Review submitted documents and verify or reject applicant credentials. |
| 🧑🏫 **Department Head** | Define degree programs, set capacity/merit criteria, add entry test scores, and generate final merit lists. |
| 👑 **System Admin** | God-mode. Manage all user roles, oversee high-level analytics, and configure global portal settings. |

---

## 🔄 Application Flow

1. **Browsing:** Users land on the portal and browse available programs (e.g., BS Computer Science, MS Physics).
2. **Applying:** A student registers, fills out an application, and uploads their transcripts.
3. **Verification:** An **Admissions Officer** logs in, reviews the uploaded documents, and marks them as `Verified`.
4. **Testing:** The **Department Head** inputs the student's entry test scores into the system.
5. **Selection:** Once the deadline passes, the **Department Head** clicks `Generate Merit List`. The system auto-calculates composite scores (based on past academics + test scores) and admits the top `N` students based on program capacity!

---

## 📂 Folder Structure

```text
📦 admission-portal
 ┣ 📂 backend
 ┃ ┣ 📂 config          # Database connection strings
 ┃ ┣ 📂 controllers     # Business logic for auth, programs, and applications
 ┃ ┣ 📂 middleware      # JWT validation and Role-Based Access Control (RBAC)
 ┃ ┣ 📂 models          # Mongoose DB Schemas
 ┃ ┗ 📂 routes          # Express API route definitions
 ┣ 📂 src               # React Frontend
 ┃ ┣ 📂 components      # Reusable UI components & Dashboards
 ┃ ┣ 📂 context         # Global AppContext (State Management)
 ┃ ┣ 📂 types           # Shared TypeScript interfaces
 ┃ ┣ 📜 App.tsx         # Main React Router
 ┃ ┣ 📜 index.css       # Tailwind configuration & global styles
 ┃ ┗ 📜 main.tsx        # React DOM Entry Point
 ┣ 📜 .env.example      # Environment variable template
 ┣ 📜 package.json      # Dependencies and scripts
 ┣ 📜 server.ts         # Main Express Server Entry Point
 ┗ 📜 vite.config.ts    # Vite bundler configuration
```

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/admission-portal.git
cd admission-portal
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up environment variables
Create a `.env` file in the root directory and add the following:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/admission_db
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 4️⃣ Start the Development Server
```bash
npm run dev
```
The server and frontend will both boot up concurrently at `http://localhost:3000`.

---

## 🌐 Deployment (Render)

This project is configured for continuous deployment on **Render** as a monolithic web service. 
* **Build Command:** `npm run build` *(Runs Vite build, then bundles the Express server to ESM via esbuild).*
* **Start Command:** `npm start` *(Executes `node dist/server.js`).*

---

## 📡 API Reference Summary

The backend exposes a secure REST API. Protected routes require a `Bearer <token>` in the Authorization header.

* 🔐 **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/users`
* 📚 **Programs:** `/api/programs` (GET, POST, PUT, DELETE)
* 📝 **Applications:** `/api/applications/apply`, `/api/applications/my-applications`, `/api/applications/:id/verify`, `/api/applications/generate-merit-list/:programId`

---
<div align="center">
  <i>Built with ❤️ for better education management.</i>
</div>
