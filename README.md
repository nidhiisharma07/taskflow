# 🚀 TaskFlow – Team Task Manager (Full Stack)

A modern full-stack web application to manage team projects, assign tasks, track progress, and collaborate in real-time.

---

## 🌐 Live Demo

* **Frontend (Vercel):** https://your-frontend.vercel.app
* **Backend (Railway):** https://your-backend.up.railway.app

---

## 📦 Features

### 🔐 Authentication

* User Signup & Login (JWT आधारित)
* Secure password hashing

### 📁 Project Management

* Create & manage projects
* Assign team members

### ✅ Task Management

* Create, update, delete tasks
* Assign tasks to users
* Set priority (High / Medium / Low)
* Track status (To Do / In Progress / Done)

### 📊 Dashboard

* Total tasks count
* Completed, Pending, In-progress stats
* Progress bar visualization

### 💬 Comments System

* Add comments on tasks
* View all comments per task

### ⚡ Real-time Updates

* Live task updates using Socket.io

### 🌙 UI/UX

* Dark mode support
* Smooth animations (Framer Motion)
* Loading skeletons
* Responsive design

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Socket.io

---

## 📁 Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── .env.example
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=*
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=your_backend_url/api
```

---

## 🚀 Local Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🌍 Deployment

### Backend (Railway)

* Upload backend folder
* Add environment variables
* Start command: `node src/server.js`

### Frontend (Vercel)

* Deploy frontend folder
* Add env variable:

  ```
  VITE_API_URL=https://your-backend-url/api
  ```

---

## 🎥 Demo Video

👉 Add your demo video link here

---

## 📌 Future Improvements

* Role-based access (Admin/Member)
* Notifications system
* File attachments
* Email alerts

---

## 👩‍💻 Author

**Nidhi Sharma**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
