# API Documentation

## Base URL

```http
http://localhost:3000
```

## Table of Contents
- [Authentication](#authentication)
- [User Management](#user-management)
- [Posts](#posts)
- [Comments](#comments)
- [Chat](#chat--messages)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json
```

#### Request Body
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

#### Success Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": "user_id",
      "name": "user_name",
      "email": "user_email"
    }
  }
}
```

### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "string",
  "verificationCode": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

### Resend Verification Code
```http
POST /auth/resend-verification-code
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Verification code sent successfully"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": "user_id",
      "name": "user_name",
      "email": "user_email"
    }
  }
}
```

### Change Password
```http
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json
```

#### Request Body
```json
{
  "email": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Password reset instructions sent to email"
}
```

### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json
```

#### Request Body
```json
{
  "token": "string",
  "newPassword": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

### Logout from All Devices
```http
POST /auth/logout-all
Authorization: Bearer <token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Logged out from all devices"
}
```

## User Management

### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "name": "string",
      "email": "string",
      "hobbies": ["string"],
      "dateOfBirth": "string",
      "location": {
        "type": "Point",
        "coordinates": [number, number]
      },
      "academicQualification": [
        {
          "passedYear": "number",
          "degreeName": "string"
        }
      ],
      "followers": ["user_id"],
      "following": ["user_id"]
    }
  }
}
```

### Update Hobbies
```http
PUT /user/hobbies
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "hobbies": ["string"]
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "hobbies": ["string"]
  }
}
```

### Delete Hobby
```http
DELETE /user/hobbies
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "hobby": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Hobby deleted successfully"
}
```

### Update Academic Qualifications
```http
PUT /user/academic-qualification
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "academicQualification": [
    {
      "passedYear": "number",
      "degreeName": "string"
    }
  ]
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "academicQualification": [
      {
        "passedYear": "number",
        "degreeName": "string"
      }
    ]
  }
}
```

### Delete Academic Qualification
```http
DELETE /user/academic-qualification
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "qualificationId": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Academic qualification deleted successfully"
}
```

### Update Date of Birth
```http
PUT /user/date-of-birth
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "dateOfBirth": "YYYY-MM-DD"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "dateOfBirth": "YYYY-MM-DD"
  }
}
```

### Update Location
```http
PUT /user/location
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "location": {
    "type": "Point",
    "coordinates": [number, number]
  }
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "location": {
      "type": "Point",
      "coordinates": [number, number]
    }
  }
}
```

### Get Followers
```http
GET /user/followers
Authorization: Bearer <token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "followers": [
      {
        "id": "user_id",
        "name": "string",
        "email": "string"
      }
    ]
  }
}
```

### Get Following
```http
GET /user/following
Authorization: Bearer <token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "following": [
      {
        "id": "user_id",
        "name": "string",
        "email": "string"
      }
    ]
  }
}
```

### Follow User
```http
POST /user/follow
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "followUserId": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "User followed successfully"
}
```

### Unfollow User
```http
POST /user/unfollow
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "unfollowUserId": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "User unfollowed successfully"
}
```

## Posts

### Create Post
```http
POST /posts/uploadpost
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body
```
title: string
content: string
image: File (optional)
```

#### Success Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "post": {
      "id": "post_id",
      "title": "string",
      "content": "string",
      "image": "string",
      "author": {
        "id": "user_id",
        "name": "string"
      },
      "likesCounter": 0,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### Get Posts (Paginated)
```http
GET /posts/getposts?page=1&limit=10
Authorization: Bearer <token>
```

#### Query Parameters
- page (default: 1)
- limit (default: 10)

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "id": "post_id",
        "title": "string",
        "content": "string",
        "image": "string",
        "author": {
          "id": "user_id",
          "name": "string"
        },
        "likesCounter": "number",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalPosts": "number"
    }
  }
}
```

### Get User Feed
```http
GET /posts/showfeed?page=1&limit=10
Authorization: Bearer <token>
```

#### Query Parameters
- page (default: 1)
- limit (default: 10)

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "id": "post_id",
        "title": "string",
        "content": "string",
        "image": "string",
        "author": {
          "id": "user_id",
          "name": "string"
        },
        "likesCounter": "number",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalPosts": "number"
    }
  }
}
```

### Get Post by ID
```http
GET /posts/postbyid/:id
Authorization: Bearer <token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "post": {
      "id": "post_id",
      "title": "string",
      "content": "string",
      "image": "string",
      "author": {
        "id": "user_id",
        "name": "string"
      },
      "likesCounter": "number",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### Update Post
```http
PUT /posts/updatepost/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body
```
title: string
content: string
image: File (optional)
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "post": {
      "id": "post_id",
      "title": "string",
      "content": "string",
      "image": "string",
      "author": {
        "id": "user_id",
        "name": "string"
      },
      "likesCounter": "number",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### Delete Post
```http
DELETE /posts/deletepost/:id
Authorization: Bearer <token>
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Post deleted successfully"
}
```

### Like/Unlike Post
```http
POST /posts/likepost
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "postId": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Post liked/unliked successfully",
  "data": {
    "likesCounter": "number"
  }
}
```

## Comments

### Add Comment
```http
POST /comment/add
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "postId": "string",
  "content": "string"
}
```

#### Success Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "comment": {
      "id": "comment_id",
      "content": "string",
      "author": {
        "id": "user_id",
        "name": "string"
      },
      "post": "post_id",
      "createdAt": "datetime"
    }
  }
}
```

### Update Comment
```http
PUT /comment/update
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "commentId": "string",
  "content": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "comment": {
      "id": "comment_id",
      "content": "string",
      "author": {
        "id": "user_id",
        "name": "string"
      },
      "post": "post_id",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### Delete Comment
```http
DELETE /comment/delete
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "commentId": "string"
}
```

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "Comment deleted successfully"
}
```

### Get Post Comments
```http
GET /posts/postcomments/:postId?page=1&limit=10
Authorization: Bearer <token>
```

#### Query Parameters
- page (default: 1)
- limit (default: 10)

#### Success Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "comments": [
      {
        "id": "comment_id",
        "content": "string",
        "author": {
          "id": "user_id",
          "name": "string"
        },
        "createdAt": "datetime"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalComments": "number"
    }
  }
}
```

## Error Responses

### Validation Error (422)
```json
{
  "status": "error",
  "code": 422,
  "message": "Validation failed",
  "errors": {
    "field": "error message"
  }
}
```

### Authentication Error (401)
```json
{
  "status": "error",
  "code": 401,
  "message": "Invalid token or unauthorized"
}
```

### Not Found Error (404)
```json
{
  "status": "error",
  "code": 404,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "status": "error",
  "code": 500,
  "message": "Internal server error"
}
```

