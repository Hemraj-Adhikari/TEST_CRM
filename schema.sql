-- ============================================================
-- Route 2 Uni CRM - Database Schema
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS route2uni_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE route2uni_crm;

-- ─── Users & Auth ────────────────────────────────────────────
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,         -- bcrypt hash
  role        ENUM('super_admin','admin','internal_user','application_user','channel_partner') NOT NULL DEFAULT 'internal_user',
  avatar      VARCHAR(10),
  avatar_color VARCHAR(10),
  status      ENUM('active','inactive') NOT NULL DEFAULT 'active',
  last_login  DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token      VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Customers ───────────────────────────────────────────────
CREATE TABLE customers (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  first_name   VARCHAR(80) NOT NULL,
  last_name    VARCHAR(80),
  email        VARCHAR(150),
  phone        VARCHAR(30),
  company      VARCHAR(150),
  address      TEXT,
  nationality  VARCHAR(80),
  passport_no  VARCHAR(50),
  passport_expiry DATE,
  date_of_birth DATE,
  gender       ENUM('male','female','other'),
  status       ENUM('active','inactive','lead') DEFAULT 'active',
  assigned_to  INT,                            -- FK → users.id
  created_by   INT,
  avatar       VARCHAR(10),
  avatar_color VARCHAR(10),
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE customer_tags (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  tag         VARCHAR(50) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ─── Notes & Activity ────────────────────────────────────────
CREATE TABLE notes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  user_id     INT,
  note_text   TEXT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE activity_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('customer','lead','task','user') NOT NULL,
  entity_id   INT NOT NULL,
  action      VARCHAR(100) NOT NULL,          -- e.g. "status_changed", "note_added"
  old_value   JSON,
  new_value   JSON,
  user_id     INT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ─── Files / Documents ───────────────────────────────────────
CREATE TABLE files (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  customer_id  INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name  VARCHAR(255) NOT NULL,
  mime_type    VARCHAR(100),
  file_size    INT,                           -- bytes
  uploaded_by  INT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ─── Leads ───────────────────────────────────────────────────
CREATE TABLE leads (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(150) NOT NULL,
  email        VARCHAR(150),
  phone        VARCHAR(30),
  company      VARCHAR(150),
  source       ENUM('website','referral','linkedin','cold_call','event','other') DEFAULT 'website',
  status       ENUM('new','contacted','converted','lost') DEFAULT 'new',
  assigned_to  INT,
  value        DECIMAL(12,2) DEFAULT 0,
  converted_customer_id INT,                 -- FK → customers.id once converted
  created_by   INT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by)  REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (converted_customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- ─── Tasks ───────────────────────────────────────────────────
CREATE TABLE tasks (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  priority     ENUM('urgent','high','medium','low') DEFAULT 'medium',
  status       ENUM('pending','in_progress','completed') DEFAULT 'pending',
  due_date     DATE,
  assigned_to  INT,
  created_by   INT,
  customer_id  INT,                           -- optional: linked customer
  lead_id      INT,                           -- optional: linked lead
  completed_at DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to)  REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by)   REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id)  REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id)      REFERENCES leads(id) ON DELETE SET NULL
);

-- ─── Notifications ───────────────────────────────────────────
CREATE TABLE notifications (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  title        VARCHAR(255) NOT NULL,
  body         TEXT,
  entity_type  VARCHAR(50),
  entity_id    INT,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Email Log ───────────────────────────────────────────────
CREATE TABLE email_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  customer_id  INT,
  sent_by      INT,
  to_email     VARCHAR(150) NOT NULL,
  subject      VARCHAR(255),
  body         TEXT,
  status       ENUM('sent','failed','pending') DEFAULT 'pending',
  sent_at      DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (sent_by)     REFERENCES users(id) ON DELETE SET NULL
);

-- ─── Seed Data ───────────────────────────────────────────────
INSERT INTO users (name, email, password, role, avatar, avatar_color) VALUES
  ('Hemraj Ji',         'hemraj.route2uni@gmail.com', '$2b$10$placeholder_hash', 'admin',           'HJ', '#F5A623'),
  ('Jitendra Sharma',   'er.jitendrasharma1999@gmail.com', '$2b$10$placeholder_hash', 'admin',      'JS', '#3B82F6'),
  ('Hemraj Adhikari',   'hemrajadhikariy@gmail.com', '$2b$10$placeholder_hash', 'internal_user',   'HA', '#8B5CF6');

INSERT INTO customers (first_name, last_name, email, phone, company, nationality, status, avatar, avatar_color, created_by) VALUES
  ('Pramila', 'Shakya', 'pramil@gmail.com',   '+9779709709019', 'Tech Ventures',    'Albanian', 'active', 'PS', '#8B5CF6', 1),
  ('Arjun',   'Thapa',  'arjun@business.com', '+9779812345678', 'Global Solutions',  'Nepali',  'active', 'AT', '#3B82F6', 1),
  ('Sita',    'Rai',    'sita.rai@corp.com',  '+9779856789012', 'Rai Enterprises',   'Nepali',  'inactive','SR','#10B981', 1);

INSERT INTO leads (name, email, phone, company, source, status, assigned_to, value, created_by) VALUES
  ('Rajesh Kumar',  'rajesh@gmail.com', '+9779801234567', 'Kumar Corp',    'website',  'new',       1, 50000, 1),
  ('Anita Bhattarai','anita@mail.com',  '+9779812233445', 'Bhattarai Ltd', 'referral', 'contacted', 2, 75000, 1),
  ('Deepak Acharya','deepak@biz.np',   '+9779823344556', 'Acharya Holdings','linkedin','converted', 1,120000, 1);

INSERT INTO tasks (title, description, priority, status, due_date, assigned_to, customer_id, created_by) VALUES
  ('Follow up with Pramila Shakya', 'Send university options', 'high',   'pending',     '2026-05-10', 1, 1, 1),
  ('Prepare proposal for Rajesh Kumar','Include pricing',      'urgent', 'in_progress', '2026-05-08', 2, NULL,1),
  ('Document verification - Arjun Thapa','Collect passport',  'medium', 'completed',   '2026-05-12', 1, 2, 1);
