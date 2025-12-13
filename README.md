# Sweet Shop Management System 🍬

A full-stack **Sweet Shop Management System** developed as a technical assignment.  
The project demonstrates backend API development, database integration, role-based access control, testing using **Test-Driven Development (TDD)** principles, and clean coding practices.

---

## 🎯 Project Objective

To design and build a Sweet Shop Management System that showcases:
- RESTful backend API design
- MongoDB database integration
- Role-based access (Admin / Customer)
- Automated backend testing
- Clean Git workflow and documentation
- Transparent usage of AI tools

---

## 🚀 Features

### 👤 Authentication & Authorization
- User registration API
- User login API
- Role-based access control:
  - **Admin**
  - **Customer**
- Authentication middleware structure (`protect`, `adminOnly`)

> **Note:** Token-based authentication (JWT) was planned and partially scaffolded but not fully implemented due to time constraints.  
> The current architecture supports easy JWT integration in the future.

---

### 🍭 Sweet Management (Admin Only)
- Add new sweets
- View all sweets
- Update sweet details
- Delete sweets
- Restock sweets

---

### 🛒 Customer Features
- View available sweets
- Purchase sweets
- Sweet stock quantity is reduced after purchase

---

### 🧪 Testing (TDD)
- Backend APIs tested using **Jest** and **Supertest**
- Test cases written for:
  - Authentication routes
  - Sweet routes
- Followed **Red → Green → Refactor** approach wherever applicable

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Express middleware for authentication and role-based access

### Testing
- Jest
- Supertest

---

## 📂 Project Structure

```
sweet-shop/
├── README.md
├── .gitignore
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Sweet.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── sweets.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── sweets.test.js
│   └── package.json
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

## ⚙️ Setup Instructions (Local)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/sweet-shop-management-system.git
cd sweet-shop-management-system
```

---

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
```

Start the backend server:
```bash
npm run dev
```

Backend runs on:
```
http://localhost:5001
```

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🧪 Running Tests

From the `backend/` directory:

```bash
npm test
```

This runs automated tests for authentication and sweet management APIs.

---

## 🧠 My AI Usage (Mandatory)

### AI Tools Used
- **ChatGPT**

---

### How I Used AI
- Debugging Jest and ES Module configuration issues
- Designing backend folder structure and middleware flow
- Writing and fixing Jest & Supertest test cases
- Resolving MongoDB Atlas connection and environment issues
- Git workflow guidance (mono-repo setup, `.gitignore`, clean commits)
- README documentation structure and clarity

---

### Reflection on AI Usage
AI helped accelerate development and troubleshooting while maintaining best practices. All suggestions were reviewed, understood, and manually implemented to ensure correctness and learning.

---

## 📸 Screenshots
*(Optional – Screenshots can be added if required)*

---

## 🌐 Deployment
*(Optional – Application not deployed yet)*

---

## 📌 Notes
- `node_modules` are excluded using `.gitignore`
- MongoDB Atlas is used as the database
- Clean and modular backend architecture is followed
- Project is maintained as a single Git repository (mono-repo)

---

## 👨‍💻 Author
**Sanskar Pawar**
