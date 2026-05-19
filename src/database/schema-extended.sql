-- Documents Table for Medical Records
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    document_type VARCHAR(100),
    description TEXT,
    file_key VARCHAR(500),
    file_url TEXT,
    file_size INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device Tokens for Push Notifications
CREATE TABLE device_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE,
    device_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Telemedicine Sessions
CREATE TABLE telemedicine_sessions (
    id SERIAL PRIMARY KEY,
    consultation_id INT REFERENCES consultations(id),
    session_id VARCHAR(100) UNIQUE,
    meeting_id VARCHAR(100),
    meeting_token VARCHAR(500),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration_minutes INT,
    status VARCHAR(50),
    recording_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queue Management
CREATE TABLE queue_management (
    id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES appointments(id),
    queue_number INT,
    status VARCHAR(50) DEFAULT 'waiting',
    estimated_wait_minutes INT,
    called_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_documents_patient_id ON documents(patient_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);
CREATE INDEX idx_telemedicine_sessions_consultation_id ON telemedicine_sessions(consultation_id);
CREATE INDEX idx_queue_management_appointment_id ON queue_management(appointment_id);