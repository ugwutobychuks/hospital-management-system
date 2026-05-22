CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password TEXT,
  role VARCHAR(50) DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT NOW()
);
