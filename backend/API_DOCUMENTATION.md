# Route 2 Uni CRM - Backend API Documentation

## Overview

This is a Node.js/Express backend API for the Route 2 Uni CRM application. It provides endpoints for authentication, customer management, leads management, and task management.

**Base URL:** `http://localhost:5000/api`

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require a valid JWT token in the `Authorization` header.

### Header Format
```
Authorization: Bearer {JWT_TOKEN}
```

### Default Test Credentials
- **Email:** `hemraj.route2uni@gmail.com`
- **Password:** `password123`
- **Role:** `Admin`

## API Endpoints

### 1. Authentication

#### Login
- **Method:** POST
- **Endpoint:** `/auth/login`
- **Body:**
  ```json
  {
    "email": "hemraj.route2uni@gmail.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Hemraj Ji",
      "email": "hemraj.route2uni@gmail.com",
      "role": "Admin"
    }
  }
  ```

#### Register
- **Method:** POST
- **Endpoint:** `/auth/register`
- **Body:**
  ```json
  {
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as login

---

### 2. Customers

#### Get All Customers
- **Method:** GET
- **Endpoint:** `/customers`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Pramila Shakya",
      "email": "pramil@gmail.com",
      "phone": "+977 9709709019",
      "company": "Tech Ventures",
      "address": "Kathmandu, Nepal",
      "status": "Active",
      "tags": ["VIP"],
      "avatar": "PS",
      "avatarColor": "#8B5CF6",
      "createdAt": "2026-01-15",
      "notes": [],
      "files": []
    }
  ]
  ```

#### Create Customer
- **Method:** POST
- **Endpoint:** `/customers`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+977 9800000000",
    "company": "Tech Company",
    "address": "Kathmandu",
    "status": "Active"
  }
  ```
- **Response:** (Returns created customer object with ID)

#### Update Customer
- **Method:** PUT
- **Endpoint:** `/customers/:id`
- **Auth Required:** Yes
- **Body:** (Any fields to update)
- **Response:** (Returns updated customer object)

#### Delete Customer
- **Method:** DELETE
- **Endpoint:** `/customers/:id`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "message": "Customer deleted",
    "customer": { ... }
  }
  ```

---

### 3. Leads

#### Get All Leads
- **Method:** GET
- **Endpoint:** `/leads`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Rajesh Kumar",
      "email": "rajesh@gmail.com",
      "phone": "+977 9801234567",
      "company": "Kumar Corp",
      "source": "Website",
      "status": "New",
      "assignedTo": "Hemraj Ji",
      "value": 50000,
      "createdAt": "2026-05-01"
    }
  ]
  ```

#### Create Lead
- **Method:** POST
- **Endpoint:** `/leads`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "name": "New Lead",
    "email": "lead@example.com",
    "phone": "+977 9800000000",
    "company": "Lead Company",
    "source": "Website",
    "status": "New",
    "assignedTo": "Hemraj Ji",
    "value": 25000
  }
  ```
- **Response:** (Returns created lead object with ID)

#### Update Lead
- **Method:** PUT
- **Endpoint:** `/leads/:id`
- **Auth Required:** Yes
- **Body:** (Any fields to update)
- **Response:** (Returns updated lead object)

#### Delete Lead
- **Method:** DELETE
- **Endpoint:** `/leads/:id`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "message": "Lead deleted",
    "lead": { ... }
  }
  ```

---

### 4. Tasks

#### Get All Tasks
- **Method:** GET
- **Endpoint:** `/tasks`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Follow up with Pramila Shakya",
      "description": "Send university options",
      "assignedTo": "Hemraj Ji",
      "dueDate": "2026-05-10",
      "priority": "High",
      "status": "Pending"
    }
  ]
  ```

#### Create Task
- **Method:** POST
- **Endpoint:** `/tasks`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "title": "New Task",
    "description": "Task description",
    "assignedTo": "Hemraj Ji",
    "dueDate": "2026-05-15",
    "priority": "Medium"
  }
  ```
- **Response:** (Returns created task object with ID and status: "Pending")

#### Update Task
- **Method:** PUT
- **Endpoint:** `/tasks/:id`
- **Auth Required:** Yes
- **Body:** (Any fields to update)
- **Response:** (Returns updated task object)

#### Delete Task
- **Method:** DELETE
- **Endpoint:** `/tasks/:id`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "message": "Task deleted",
    "task": { ... }
  }
  ```

---

### 5. Health Check

#### Health Status
- **Method:** GET
- **Endpoint:** `/health`
- **Auth Required:** No
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "Backend is running"
  }
  ```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Status Codes
- **200:** OK - Successful request
- **201:** Created - Resource successfully created
- **400:** Bad Request - Missing or invalid parameters
- **401:** Unauthorized - Missing or invalid JWT token
- **404:** Not Found - Resource not found
- **500:** Internal Server Error - Server error

---

## Example cURL Requests

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hemraj.route2uni@gmail.com","password":"password123"}'
```

### Get All Leads (with token)
```bash
curl -X GET http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Lead (with token)
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"+977 9800000000",
    "company":"Tech Corp",
    "source":"Website",
    "status":"New",
    "assignedTo":"Hemraj Ji",
    "value":50000
  }'
```

### Delete Lead (with token)
```bash
curl -X DELETE http://localhost:5000/api/leads/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Data Storage

The backend uses **in-memory storage** with JavaScript arrays. This means:

- All data is lost when the server restarts
- No database setup required
- Perfect for development and testing

To persist data permanently, you would need to:
1. Set up a database (MongoDB, PostgreSQL, MySQL, etc.)
2. Replace the in-memory arrays with database queries

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Frontend Vite dev server)

To allow requests from other origins, update the `CORS_ORIGIN` environment variable in `.env`

---

## Environment Variables (.env)

```
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## Running the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server (auto-reload with nodemon)
npm run dev

# Start production server
npm start
```

---

## File Structure

```
backend/
├── src/
│   ├── app.js                 # Express app setup and routes
│   ├── server.js              # Server entry point
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── customers.controller.js
│   │   ├── leads.controller.js
│   │   └── tasks.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── customers.routes.js
│   │   ├── leads.routes.js
│   │   └── tasks.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   └── .env
├── package.json
└── API_DOCUMENTATION.md (this file)
```

---

## Support & Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Ensure all dependencies are installed (`npm install`)
- Check `.env` file for correct environment variables

### JWT errors
- Make sure to include the `Authorization` header with Bearer token
- Token format: `Authorization: Bearer {token}`
- Token expires every 7 days by default

### CORS errors
- Check that the frontend origin matches `CORS_ORIGIN` in `.env`
- Frontend should be running on `http://localhost:5173`

---

## License

Route 2 Uni CRM © 2026
