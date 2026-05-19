-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    phone VARCHAR(20),
    organization_id INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    hospital_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    blood_type VARCHAR(5),
    genotype VARCHAR(5),
    allergies TEXT,
    next_of_kin VARCHAR(100),
    next_of_kin_phone VARCHAR(20),
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    registration_date DATE,
    phone VARCHAR(20),
    availability JSONB,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id),
    appointment_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    queue_number INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultations Table
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id),
    patient_id INT REFERENCES patients(id),
    chief_complaint TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    notes TEXT,
    vital_signs JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    consultation_id INT REFERENCES consultations(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id),
    patient_id INT REFERENCES patients(id),
    drug_name VARCHAR(255),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    quantity INT,
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Tests Table
CREATE TABLE lab_tests (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id),
    test_name VARCHAR(255),
    test_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    sample_collected BOOLEAN DEFAULT false,
    result JSONB,
    reference_range TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Inventory Table
CREATE TABLE pharmacy_inventory (
    id SERIAL PRIMARY KEY,
    drug_name VARCHAR(255) NOT NULL,
    drug_code VARCHAR(50) UNIQUE,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2),
    batch_number VARCHAR(50),
    expiry_date DATE,
    reorder_level INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dispensing Table
CREATE TABLE dispensing (
    id SERIAL PRIMARY KEY,
    prescription_id INT REFERENCES prescriptions(id),
    pharmacist_id INT REFERENCES users(id),
    quantity_dispensed INT,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    dispensed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing Table
CREATE TABLE billing (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    description VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    invoice_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HMO/Insurance Table
CREATE TABLE hmo_plans (
    id SERIAL PRIMARY KEY,
    hmo_name VARCHAR(255) NOT NULL,
    plan_code VARCHAR(50) UNIQUE,
    max_coverage DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- HMO Enrollees
CREATE TABLE hmo_enrollees (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    hmo_id INT REFERENCES hmo_plans(id),
    member_id VARCHAR(50) UNIQUE,
    enrollment_date DATE,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims Table
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    hmo_id INT REFERENCES hmo_plans(id),
    billing_id INT REFERENCES billing(id),
    claim_amount DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'pending',
    claim_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ward Beds Table
CREATE TABLE ward_beds (
    id SERIAL PRIMARY KEY,
    bed_number VARCHAR(50) UNIQUE,
    ward_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available',
    patient_id INT REFERENCES patients(id),
    admission_date TIMESTAMP,
    discharge_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(255),
    entity_type VARCHAR(100),
    entity_id INT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_patients_hospital_id ON patients(hospital_id);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_lab_tests_patient_id ON lab_tests(patient_id);
CREATE INDEX idx_billing_patient_id ON billing(patient_id);
CREATE INDEX idx_billing_status ON billing(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);