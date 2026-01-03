# EduSphere - Government Verification Portal

This is a full-stack application for managing and verifying educational institutes.

## 🚀 How to Run Locally

Follow these steps to run the project on your machine.

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Git**
- A **PostgreSQL Database** connection string (from Neon.tech or Supabase).

### 2. Setup Server (Backend)
The backend handles authentication, database connections, and API logic.

1.  **Open a terminal** and navigate to the server directory:
    ```bash
    cd server
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Check Environment Variables**:
    *   Open `server/.env`.
    *   Ensure `DATABASE_URL` is set to your PostgreSQL connection string.
    *   Ensure `JWT_SECRET` is set.
4.  **Database Setup** (Only if you haven't run this recently):
    ```bash
    npx prisma generate
    npx prisma db push
    npm run seed   # Seeding admin user (GOV001/admin)
    ```
5.  **Start the Server**:
    ```bash
    npm run dev
    ```
    *   You should see: `🚀 Server running on port 5000` and `✅ Database connected successfully`.

### 3. Setup Client (Frontend)
The frontend is the React user interface.

1.  **Open a NEW terminal window** (keep the server running in the first one).
2.  Navigate to the client directory:
    ```bash
    cd client
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Start the Frontend**:
    ```bash
    npm run dev
    ```
5.  **Open in Browser**:
    *   Click the link shown in the terminal (usually `http://localhost:5173`).

---

## 🔑 Default Login Credentials

After seeding the database (`npm run seed`), you can use these credentials:

*   **Government Officer (Admin)**:
    *   **Employee ID**: `GOV001`
    *   **Password**: `admin`

*   **College**:
    *   You need to **Register** a new college from the home page.

*   **Student**:
    *   Login uses OTP (Mobile Number). Enter any valid 10-digit number.
    *   OTP is hardcoded for development logs (check console/server logs) or usually just accepted in test mode.

---

## ☁️ Deployment

*   **Frontend**: Hosted on Vercel.
*   **Backend**: Hosted on Render.
*   **Database**: Hosted on Neon/Supabase.

To deploy updates, simply push your code to **GitHub**. Render and Vercel are configured to auto-deploy new commits.
