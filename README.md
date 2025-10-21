# 🌐 Social Networking API

A robust RESTful API for a social networking platform built with Express.js, TypeScript, and MongoDB. It supports user management, posts, comments, messaging, authentication, and more.

## 🚀 Features

- JWT-based authentication (register, login, password management, logout)
- User profile management (hobbies, academic qualifications, location, followers/following)
- CRUD operations for posts with image upload
- Like/unlike posts
- Nested comments system
- Real-time messaging and chat
- Feed and activity endpoints
- Secure file upload and validation
- Pagination and search support

## 🛠️ Tech Stack

- **Node.js** (TypeScript)
- **Express.js**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Validator.js** for input validation
- **Nodemon** for development

## 📁 Project Structure

```
src/
├── config/         # DB and environment config
├── controllers/    # Route handlers (auth, user, post, comment, message)
├── middlewares/    # JWT, file upload, validation
├── models/         # Mongoose schemas (user, post, comment, message, conversation)
├── routes/         # API route definitions
├── types/          # TypeScript types
└── server.ts       # App entry point
my-uploads/         # Uploaded media files
views/              # Email templates
```

## 🚦 Getting Started

### Prerequisites

- Node.js v14+
- MongoDB
- TypeScript

### Installation

```bash
git clone <repository-url>
cd socialnetworkingapi
npm install
```

### Environment Setup

Create a `.env` file:

```
PORT=3000
MONGO_URL=mongodb://localhost:27017/socialnetwork
JWT_SECRET=your_jwt_secret
APP_EMAIL=youremail
APP_PASS= your_password
```

### Running the Server

```bash
npm run dev
```

## 📡 API Endpoints

See [API.md](./API.md) for full documentation.

### Main Endpoints

- **Auth:** `/auth/register`, `/auth/login`, `/auth/change-password`, `/auth/logout`, `/auth/logout-all`, `/auth/forgot-password`, `/auth/reset-password`
- **User:** `/user/profile`, `/user/hobbies`, `/user/academic-qualification`, `/user/date-of-birth`, `/user/location`, `/user/follow`, `/user/unfollow`, `/user/followers`, `/user/following`
- **Posts:** `/posts/uploadpost`, `/posts/getposts`, `/posts/postbyid/:id`, `/posts/updatepost/:id`, `/posts/deletepost/:id`, `/posts/likepost`, `/posts/showfeed`
- **Comments:** `/comment/add`, `/posts/postcomments/:postId`
- **Chat:** `/chat/send-message`, `/chat/messages/:conversationId`, `/chat/conversation-list`, `/chat/read-messages/:conversationId`

## 🔒 Security

- JWT authentication and route protection
- Password hashing (bcrypt)
- File type and size validation
- CORS enabled
- Input validation

## 💾 Database Models

- **User:** name, email, password, hobbies, academicQualification, location, followers, following, etc.
- **Post:** title, content, image, author, likesCounter, comments
- **Comment:** content, author, post, createdAt
- **Message:** sender, recipient, content, timestamp
- **Conversation:** participants, messages

## ⚠️ Error Handling

Consistent error responses with status codes and messages.

## 📊 Performance

- Pagination for lists
- Indexed fields for fast queries
- Efficient file handling

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit and push your changes
4. Open a Pull Request

## 📄 License

ISC License
