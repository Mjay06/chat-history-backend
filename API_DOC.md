# Chat History Backend API

This document describes how to install, run, and use the Chat History Backend API in this repository.

## 1. Overview

The backend is a small Express + MongoDB service for managing:

- chat sessions
- chat messages inside each session
- deletion of sessions and related chat history

Base URL when running locally:

http://localhost:<PORT>

All routes are prefixed with `/api`.

Example:

http://localhost:3000/api/sessions

---

## 2. Requirements

- Node.js 16 or newer
- MongoDB Atlas or another MongoDB instance
- A `.env` file with `MONGO_URI` and `PORT`

---

## 3. Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/chat-history
# or: MONGODB_URI=mongodb://localhost:27017/chat-history
PORT=3000
```

The server accepts either `MONGO_URI` or `MONGODB_URI`. Replace the value with your real MongoDB connection string.

---

## 4. Install and Run

Install dependencies:

```powershell
npm install
```

Start the server:

```powershell
npm start
```

You can also run it directly with:

```powershell
node server.js
```

---

## 5. Data Models

### Session

- `userId` (string, required)
- `sessionId` (string, required, unique)
- `title` (string, optional, default: `New Chat`)
- `createdAt` (Date, auto-generated)

### Chat

- `sessionId` (string, required)
- `userId` (string, required)
- `role` (string, required; usually `user` or `bot`)
- `message` (string, required)
- `createdAt` (Date, auto-generated)

---

## 6. API Endpoints

All responses are JSON.

### 6.1 Create a session

- Method: `POST`
- URL: `/api/sessions`

Request body:

```json
{
  "sessionId": "sess-123",
  "userId": "user-1",
  "title": "Support chat"
}
```

Example:

```powershell
curl -Method POST -Uri http://localhost:3000/api/sessions -Headers @{"Content-Type"="application/json"} -Body (@{sessionId="sess-123"; userId="user-1"; title="Support chat"} | ConvertTo-Json)
```

Success response:

```json
{
  "_id": "<mongo-id>",
  "userId": "user-1",
  "sessionId": "sess-123",
  "title": "Support chat",
  "createdAt": "2026-06-11T12:00:00.000Z",
  "__v": 0
}
```

---

### 6.2 List sessions for a user

- Method: `GET`
- URL: `/api/sessions/:userId`

Example:

```powershell
curl http://localhost:3000/api/sessions/user-1
```

Success response:

```json
[
  {
    "_id": "<mongo-id>",
    "userId": "user-1",
    "sessionId": "sess-123",
    "title": "Support chat",
    "createdAt": "2026-06-11T12:00:00.000Z",
    "__v": 0
  }
]
```

---

### 6.3 Get chat history for a session

- Method: `GET`
- URL: `/api/chats/:sessionId`

Example:

```powershell
curl http://localhost:3000/api/chats/sess-123
```

Success response:

```json
[
  {
    "_id": "<mongo-id>",
    "sessionId": "sess-123",
    "userId": "user-1",
    "role": "user",
    "message": "Hello, help me",
    "createdAt": "2026-06-11T12:00:00.000Z",
    "__v": 0
  }
]
```

---

### 6.4 Save a chat message

- Method: `POST`
- URL: `/api/chats`

Request body:

```json
{
  "sessionId": "sess-123",
  "userId": "user-1",
  "role": "user",
  "message": "Hello there"
}
```

Example:

```powershell
curl -Method POST -Uri http://localhost:3000/api/chats -Headers @{"Content-Type"="application/json"} -Body (@{sessionId="sess-123"; userId="user-1"; role="user"; message="Hello there"} | ConvertTo-Json)
```

Success response:

```json
{
  "_id": "<mongo-id>",
  "sessionId": "sess-123",
  "userId": "user-1",
  "role": "user",
  "message": "Hello there",
  "createdAt": "2026-06-11T12:00:00.000Z",
  "__v": 0
}
```

---

### 6.5 Delete all chats for one session

- Method: `DELETE`
- URL: `/api/chats/:sessionId`

Example:

```powershell
curl -Method DELETE http://localhost:3000/api/chats/sess-123
```

Success response:

```json
{
  "message": "All chats for session 'sess-123' deleted."
}
```

---

### 6.6 Delete a session and its chats

- Method: `DELETE`
- URL: `/api/sessions/:sessionId`

Example:

```powershell
curl -Method DELETE http://localhost:3000/api/sessions/sess-123
```

Success response:

```json
{
  "message": "Session 'sess-123' and its chats deleted."
}
```

---

### 6.7 Delete all sessions and chats for one user

- Method: `DELETE`
- URL: `/api/sessions/user/:userId`

Example:

```powershell
curl -Method DELETE http://localhost:3000/api/sessions/user/user-1
```

Success response:

```json
{
  "message": "All sessions and chats for user 'user-1' deleted."
}
```

---

## 7. Error Responses

If validation or database logic fails, the API returns a `400` status code with this JSON format:

```json
{
  "error": "<error message>"
}
```

Example:

```json
{
  "error": "Chat validation failed: role: Path `role` is required."
}
```

---

## 8. Notes and Behavior

- The API uses CORS and accepts JSON requests.
- There is no authentication by default.
- MongoDB must be available before the server starts.
- Timestamps are stored in `createdAt` for both sessions and chat messages.
- This API currently supports deleting all chats for a session, not deleting a single chat message by its own ID.

---

## 9. Troubleshooting

- Verify that `MONGO_URI` and `PORT` are set in `.env`.
- Check the console output for MongoDB connection errors.
- If a route returns `400`, inspect the error message and confirm the request body matches the expected schema.

---

## 10. Future Improvements

Possible enhancements:

- Add pagination for `GET /api/chats/:sessionId`
- Add authentication and authorization
- Add a dedicated endpoint to delete one chat message by ID
