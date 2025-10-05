# 📝 Blogging API

This project is built as part of the **AltSchool Africa Backend Engineering Second Semester Examination**.  
A RESTful blogging API built with **Node.js**, **Express**, and **MongoDB**.  
It is a **Blogging API** that allows users to create, publish, update, and manage blogs while supporting authentication, pagination, filtering, and search features.

---

## 🚀 Features Implemented

- User authentication with **JWT** (tokens expire in 1 hour).
- Secure password hashing with **bcrypt**.
- Users can:
  - **Sign up** and **log in**.
  - **Create blogs** (default state = draft).
  - **Update blogs** (in both draft and published state).
  - **Publish or unpublish blogs**.
  - **Delete blogs** (draft or published).
  - **View their own blogs** with filtering by state.
- Public users (logged in or not) can:
  - View **all published blogs**.
  - View a **single published blog** (with author info).
- **Blog listing features**:
  - Pagination (default: 20 blogs per page).
  - Searchable by **title** and **tags**.
  - Filterable by **state**.
  - Orderable by **createdAt**, **reading_time**, or **read_count**.
- Automatic **reading time calculation** (words ÷ 200 words per minute).
- **Read count** increases when a blog is fetched.
- Organized with **MVC pattern** and middleware for authentication and ownership.

---

## 📂 Project Structure

blogging-api/
├─ package.json
├─ .env
├─ server.js
├─ config/
│ └─ db.js
├─ models/
│ ├─ User.js
│ └─ Blog.js
├─ controllers/
│ ├─ authController.js
│ └─ blogController.js
├─ routes/
│ ├─ auth.js
│ └─ blogs.js
├─ middleware/
│ ├─ auth.js
│ └─ owner.js
├─ utils/
│ ├─ readingTime.js
│ └─ paginate.js

## 📌 API Endpoints

### 🔑 Auth Routes

- **POST** `/v1/auth/signup` → Register a new user
- **POST** `/v1/auth/login` → Log in a user

### 📝 Blog Routes

- **GET** `/v1/blogs` → List all published blogs (search, filter, pagination)
- **POST** `/v1/blogs` → Create a blog (auth required)
- **GET** `/v1/blogs/:id` → Get a single blog
- **PUT** `/v1/blogs/:id` → Update a blog (owner only)
- **PATCH** `/v1/blogs/:id/publish` → Publish a blog (owner only)
- **DELETE** `/v1/blogs/:id` → Delete a blog (owner only)
- **GET** `/v1/blogs/user/me/list` → Get logged-in user’s blogs

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT Authentication**
- **bcrypt.js** for password hashing
- **express-validator** for validation
- **helmet**, **cors**, **morgan** for security & logging

## 📦 Deployment

This project is deployed on **Render/Heroku**.

- 🔗 **Live API URL**:
- 🔗 **GitHub Repo**:

## ✍️ Author

- **Joel Hanson**  
  AltSchool Africa – Backend Engineering Track
