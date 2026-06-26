# MarkFlow

A full-stack bookmark management application that helps users save, organize, and manage their favorite websites efficiently. MarkFlow provides secure authentication, customizable categories, favorites, ratings, logo uploads, filtering, pagination, and personalized user settings.

---

## ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📑 Create, Read, Update & Delete Bookmarks
- 🏷️ Custom Categories
- ⭐ Bookmark Ratings
- ❤️ Favorite Bookmarks
- 🖼️ Bookmark Logo Uploads (Cloudinary)
- 🔍 Search Bookmarks
- 🎯 Filter by Category, Rating, and Favorites
- 📄 Pagination
- 📊 Frequently Visited Bookmarks
- ⚙️ User Settings
  - Default Category
  - Default Rating
  - Language Preference
  - Dark Mode
- ☁️ Cloudinary Integration
- 🗄️ MongoDB Atlas
- 🔄 Database Migrations
- ✅ Express Validator
- 🚨 Centralized Error Handling

---

## 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Express Validator
- Multer
- Cloudinary
- Cookie Session

### Database

- MongoDB Atlas

### File Storage

- Cloudinary

---

## 📂 Project Structure

```text
markflow/
│
├── migrations/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── errors/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── app.js
├── index.js
├── package.json
└── .env
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/<your-username>/markflow.git

cd markflow
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_KEY=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

---

## 🔄 Database Migrations

Whenever the database schema changes, run the corresponding migration.

Example:

```bash
npm run migrate:isFavorite
```

Migration files are located in the `migrations/` directory.

---

## 📌 API Features

### Authentication

- Register User
- Login User
- Get Current User

### Categories

- Create Category
- Get Categories
- Update Category
- Delete Category

### Bookmarks

- Create Bookmark
- Update Bookmark
- Delete Bookmark
- Get Bookmark
- Get All Bookmarks
- Upload Bookmark Logo
- Frequently Visited Bookmarks

Supports:

- Search
- Pagination
- Sorting
- Category Filtering
- Rating Filtering
- Favorite Filtering

### Settings

- Create Settings
- Update Settings

---

## 🔐 Authentication

Protected routes require a JWT Bearer Token.

```http
Authorization: Bearer <your_jwt_token>
```

---

## 🖼️ Image Uploads

Bookmark logos are uploaded to Cloudinary using Multer Storage Cloudinary.

Supported formats:

- JPG
- JPEG
- PNG
- WEBP

---

## 🚀 Future Improvements

- 🔖 Bookmark Tags
- 📁 Folder Support
- 📤 Import & Export Bookmarks
- 🌐 Browser Extension
- 📱 Mobile Application
- 👥 Shared Bookmarks
- 🔔 Bookmark Reminders
- 📈 Bookmark Analytics

---

## 👨‍💻 Author

**Ajor Moses**

Frontend Engineer transitioning into Full-Stack Development, passionate about building scalable web applications.

- GitHub: https://github.com/ajormoses<@ajormoses>
- LinkedIn: https://www.linkedin.com/in/moses-ajor-0b99291a7/<AjorMoses>
