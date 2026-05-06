# Route 2 Uni CRM — Setup Guide

## 📁 Recommended Folder Structure

```
route2uni-crm/
├── frontend/                    # React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Modal, Badge, Input...
│   │   │   ├── layout/         # Sidebar, Topbar, Layout
│   │   │   └── charts/         # Chart components
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/              # useAuth, useToast, useCustomers...
│   │   ├── api/                # Axios API calls
│   │   │   ├── customers.js
│   │   │   ├── leads.js
│   │   │   └── tasks.js
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── utils/              # formatDate, exportCSV...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── customers.controller.js
│   │   │   ├── leads.controller.js
│   │   │   ├── tasks.controller.js
│   │   │   └── files.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js   # JWT verify
│   │   │   ├── role.middleware.js   # RBAC
│   │   │   └── upload.middleware.js # Multer
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── customers.routes.js
│   │   │   ├── leads.routes.js
│   │   │   └── tasks.routes.js
│   │   ├── models/             # MySQL queries / ORM models
│   │   ├── services/
│   │   │   ├── email.service.js    # Nodemailer
│   │   │   └── export.service.js   # CSV/PDF export
│   │   ├── config/
│   │   │   ├── db.js               # MySQL connection
│   │   │   └── env.js
│   │   └── app.js
│   ├── uploads/                # Uploaded files storage
│   ├── .env
│   └── package.json
│
├── database/
│   └── schema.sql              # This file!
│
└── README.md
```

---

## 🚀 Step-by-Step Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

---

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run schema
SOURCE /path/to/schema.sql;

# Verify tables
USE route2uni_crm;
SHOW TABLES;
```

---

### 2. Backend Setup

```bash
cd backend
npm init -y

# Install dependencies
npm install express mysql2 bcryptjs jsonwebtoken dotenv cors multer
npm install nodemailer json2csv pdfkit
npm install --save-dev nodemon
```

**`.env` file:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=route2uni_crm
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**`src/app.js`:**
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/customers', require('./routes/customers.routes'));
app.use('/api/leads',     require('./routes/leads.routes'));
app.use('/api/tasks',     require('./routes/tasks.routes'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
```

**`package.json` scripts:**
```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js"
  }
}
```

---

### 3. Frontend Setup

```bash
# Create Vite React app
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install axios react-router-dom recharts
npm install lucide-react
npm install @tanstack/react-query
```

**`src/api/customers.js`:**
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getCustomers = () => API.get('/customers');
export const createCustomer = (data) => API.post('/customers', data);
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);
export const exportCustomersCSV = () => API.get('/customers/export/csv', { responseType: 'blob' });
```

**Start frontend:**
```bash
npm run dev
# Runs at http://localhost:5173
```

---

### 4. REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |
| POST | `/api/customers/:id/notes` | Add note |
| POST | `/api/customers/:id/files` | Upload file |
| GET | `/api/customers/export/csv` | Export CSV |
| GET | `/api/leads` | List all leads |
| POST | `/api/leads` | Create lead |
| PUT | `/api/leads/:id` | Update lead |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id/complete` | Mark complete |
| GET | `/api/dashboard/stats` | Dashboard analytics |

---

### 5. Authentication (JWT + RBAC)

```javascript
// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// middleware/role.middleware.js
module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });
  next();
};
```

---

### 6. File Upload (Multer)

```javascript
// middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});

module.exports = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|doc|docx|jpg|jpeg|png/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  }
});
```

---

### 7. Email (Nodemailer)

```javascript
// services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

exports.sendFollowUp = async (to, customerName, staffName) => {
  await transporter.sendMail({
    from: `"Route 2 Uni" <${process.env.SMTP_USER}>`,
    to,
    subject: `Follow-up from ${staffName} at Route 2 Uni`,
    html: `<p>Dear ${customerName},<br>This is a follow-up regarding your application...</p>`
  });
};
```

---

### 8. Export CSV/PDF

```javascript
// services/export.service.js
const { Parser } = require('json2csv');

exports.exportCSV = (data, fields) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

// In controller:
router.get('/export/csv', auth, async (req, res) => {
  const customers = await db.query('SELECT * FROM customers');
  const csv = exportService.exportCSV(customers, ['first_name','last_name','email','phone','company','status']);
  res.header('Content-Type', 'text/csv');
  res.attachment('customers.csv');
  res.send(csv);
});
```

---

## 🔒 Security Checklist

- [x] Passwords hashed with bcrypt (rounds: 10)
- [x] JWT with expiry (7 days)
- [x] Role-based access control (RBAC)
- [x] File type validation
- [x] SQL injection prevention (parameterized queries)
- [x] CORS restricted to frontend origin
- [x] Rate limiting (use `express-rate-limit`)
- [x] Input validation (use `joi` or `zod`)

---

## 📦 Default Login Credentials

| Email | Password | Role |
|-------|----------|------|
| hemraj.route2uni@gmail.com | password123 | Admin |

> **Note:** Change all passwords immediately in production!

---

## 🌐 Deployment

**Frontend (Vercel/Netlify):**
```bash
npm run build
# Deploy /dist folder
```

**Backend (Railway/Render):**
```bash
# Set all .env variables in dashboard
npm start
```

**Database:** PlanetScale (MySQL-compatible) or AWS RDS
