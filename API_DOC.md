# Chat History Backend API

This document explains how to run and use the Chat History Backend API provided in this repository.

## Overview

This is a small Express + MongoDB backend that stores chat sessions and messages. The API exposes endpoints for creating sessions, listing sessions for a user, saving chat messages, and retrieving chat history for a session.

Base URL (when running locally):

http://localhost:<PORT>

All endpoints are prefixed with `/api` (for example: `http://localhost:<PORT>/api/sessions`).

## Requirements

- Node.js (16+ recommended)
- A MongoDB connection string
- Environment variables configured in a `.env` file

## Environment variables

Create a `.env` file in the project root with the following values:

MONGO_URI=<your-mongodb-connection-string>
PORT=3000

Replace `<your-mongodb-connection-string>` with your MongoDB URI.

## Install dependencies

Open PowerShell in the project folder and run:

```powershell
npm install
```

## Start the server

Run the server with:

```powershell
node server.js
```

If you want, add a `start` script to `package.json`:

```json
"scripts": {
  "start": "node server.js"
}
```

Then start with `npm start`.

## Models (quick reference)

Session
- userId: string (required)
- sessionId: string (required, unique)
- title: string (optional, default: "New Chat")
- createdAt: Date

Chat
- sessionId: string (required)
- userId: string (required)
- role: string (`user` or `bot`) (required)
- message: string (required)
- createdAt: Date

## API Endpoints

All endpoints return JSON.

1) Create a new session

- URL: POST /api/sessions
- Body (application/json):
  {
    "sessionId": "string",
    "userId": "string",
    "title": "optional title"
  }
- Response: 200 OK
  Returns the created session object.

Example (PowerShell using curl):

```powershell
curl -Method POST -Uri http://localhost:3000/api/sessions -Headers @{"Content-Type"="application/json"} -Body (@{sessionId="sess-123"; userId="user-1"; title="Support chat"} | ConvertTo-Json)
```

Sample response:

```json
{
  "_id": "<mongo-id>",
  "userId": "user-1",
  "sessionId": "sess-123",
  "title": "Support chat",
  "createdAt": "2025-10-04T...",
  "__v": 0
}
```

2) List all sessions for a user

- URL: GET /api/sessions/:userId
- Response: 200 OK
  Returns an array of session objects sorted newest first.

Example:

```powershell
curl http://localhost:3000/api/sessions/user-1
```

3) Get chat history for a session

- URL: GET /api/chats/:sessionId
- Response: 200 OK
  Returns an array of chat messages sorted oldest first.

Example:

```powershell
curl http://localhost:3000/api/chats/sess-123
```

Sample chat item:

```json
{
  "_id": "<mongo-id>",
  "sessionId": "sess-123",
  "userId": "user-1",
  "role": "user",
  "message": "Hello, help me",
  "createdAt": "2025-10-04T...",
  "__v": 0
}
```

4) Save a chat message

- URL: POST /api/chats
- Body (application/json):
  {
    "sessionId": "sess-123",
    "userId": "user-1",
    "role": "user|bot",
    "message": "The message text"
  }
- Response: 200 OK
  Returns the created chat object.

Example:

```powershell
curl -Method POST -Uri http://localhost:3000/api/chats -Headers @{"Content-Type"="application/json"} -Body (@{sessionId="sess-123"; userId="user-1"; role="user"; message="Hello"} | ConvertTo-Json)
```

5) Delete all chats for a session

- URL: DELETE /api/chats/:sessionId
- Response: 200 OK
  Returns a message confirming deletion.

Example:

```powershell
curl -Method DELETE http://localhost:3000/api/chats/sess-123
```

6) Delete all chats for a user

- URL: DELETE /api/chats/user/:userId
- Response: 200 OK
  Returns a message confirming deletion.

Example:

```powershell
curl -Method DELETE http://localhost:3000/api/chats/user/user-1
```

7) Delete a session and its chats

- URL: DELETE /api/sessions/:sessionId
- Response: 200 OK
  Returns a message confirming the session and its chats were deleted.

Example:

```powershell
curl -Method DELETE http://localhost:3000/api/sessions/sess-123
```

Error responses

- When a route encounters an error (validation, DB error, etc.) the API returns a 400 status with JSON in the form:

```json
{ "error": "<error message>" }
```

Include error handling in your client code for 400 responses.

## Notes and behavior

- The API uses CORS and accepts JSON requests.
- There is no authentication by default. If you need to secure the API, add middleware to `server.js` or `routes/chatRoutes.js`.
- MongoDB connection is required. The server will attempt to connect to `process.env.MONGO_URI` on start.
- Timestamps are stored in `createdAt` on both Session and Chat documents.

## Troubleshooting

- If the server doesn't start, check that `MONGO_URI` and `PORT` are set in `.env`.
- Check console output for errors; the server logs MongoDB connection status.

## Extending

- Add pagination to the `GET /api/chats/:sessionId` endpoint if chat history becomes large.
- Add user authentication (JWT or session-based) to restrict access to a user's own sessions and chats.

---

If you'd like, I can also add a `README.md` with the same content, example Postman collection, or a simple `npm run start` script in `package.json`.
