# 🌐 Social Networking API

A robust RESTful API for a social networking platform built with Express.js, TypeScript, and MongoDB. It supports user management, posts, comments, messaging, payments, notifications, and more.

## 🚀 Features

- **Authentication & Security**
  - JWT-based authentication (register, login, password management, logout)
  - Email verification system
  - Multi-device login management (up to 3 devices)
  - Device-specific logout capability
  - Password reset via email
  
- **User Profile**
  - Comprehensive profile management
  - Hobbies and interests tracking
  - Academic qualifications management
  - Location-based features
  - Follow/unfollow system
  
- **Content Management**
  - CRUD operations for posts with image upload
  - Like/unlike functionality
  - Nested comments system
  - Feed customization
  - Search and filtering
  
- **Messaging System**
  - Real-time chat functionality
  - Image sharing in messages
  - Premium content unlocking via payments
  - Message read status tracking
  - Conversation management
  
- **Notifications**
  - Automated system notifications
  - Custom notification templates
  - Read/unread status tracking
  - Bulk notification management
  
- **Premium Features**
  - Stripe payment integration
  - Pay-to-unlock content system
  - Secure payment processing
  - Webhook integration
  
- **Technical Features**
  - Secure file upload and validation
  - Advanced pagination
  - Search and filtering
  - Cron jobs for automated tasks

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
3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=3000                          # Application port
NODE_ENV=development               # Environment (development/production)
SALT=10                           # Password hashing salt rounds

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/social_network_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key    # Secret for JWT signing
JWT_EXPIRATION=24h               # Token expiration time

# Email Configuration (Nodemailer)
APP_EMAIL=your_email@gmail.com    # Gmail address for sending emails
APP_PASS=your_app_specific_pass   # Gmail app-specific password
EMAIL_HOST=smtp.gmail.com        # SMTP host
EMAIL_PORT=465                   # SMTP port
EMAIL_SECURE=true               # Use TLS

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...    # Stripe secret key
ENDPOINT_SECRET=whsec_...        # Stripe webhook secret
STRIPE_PRICE_ID=price_...       # Price ID for image unlocking

# File Upload Configuration
UPLOAD_PATH=my-uploads/          # Path for uploaded files
MAX_FILE_SIZE=5242880          # Max file size (5MB)

# API Configuration
RATE_LIMIT=100                 # Rate limit per 15 minutes
AUTH_RATE_LIMIT=5             # Auth endpoints rate limit per minute
```
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
