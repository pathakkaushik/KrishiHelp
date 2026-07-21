-- ============================================================
-- KrishiMitra AI — Complete MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS krishimitra_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE krishimitra_db;

-- ─── Users ──────────────────────────────────────────────────
CREATE TABLE users (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name         VARCHAR(100) NOT NULL,
    email             VARCHAR(150) NOT NULL UNIQUE,
    mobile            VARCHAR(15) NOT NULL UNIQUE,
    password          VARCHAR(255) NOT NULL,
    role              ENUM('FARMER','OFFICER','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'FARMER',
    profile_picture   VARCHAR(255),
    village           VARCHAR(100),
    district          VARCHAR(100),
    state             VARCHAR(100),
    pincode           VARCHAR(10),
    latitude          DECIMAL(10,8),
    longitude         DECIMAL(11,8),
    land_area         VARCHAR(20),
    primary_crop      VARCHAR(50),
    department        VARCHAR(100),
    designation       VARCHAR(50),
    otp               VARCHAR(6),
    otp_expiry        DATETIME,
    email_verified    BOOLEAN DEFAULT FALSE,
    mobile_verified   BOOLEAN DEFAULT FALSE,
    active            BOOLEAN DEFAULT TRUE,
    deleted           BOOLEAN DEFAULT FALSE,
    last_login        DATETIME,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_mobile (mobile),
    INDEX idx_role (role),
    INDEX idx_village (village),
    INDEX idx_district (district)
);

-- ─── Complaints ──────────────────────────────────────────────
CREATE TABLE complaints (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_number    VARCHAR(20) NOT NULL UNIQUE,
    title               VARCHAR(255) NOT NULL,
    description         TEXT NOT NULL,
    category            ENUM('WATER_IRRIGATION','ELECTRICITY','ROADS','GOVERNMENT_SCHEMES',
                             'AGRICULTURE','FERTILIZER','SEEDS','ANIMAL_HUSBANDRY',
                             'PUBLIC_SERVICES','DISASTER') NOT NULL,
    status              ENUM('OPEN','PENDING','IN_PROGRESS','RESOLVED','CLOSED','ESCALATED')
                            NOT NULL DEFAULT 'OPEN',
    priority            ENUM('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    location            VARCHAR(255),
    village             VARCHAR(100),
    district            VARCHAR(100),
    incident_date       DATE,
    user_id             BIGINT NOT NULL,
    assigned_officer_id BIGINT,
    ai_analysis         TEXT,
    ai_confidence       TINYINT DEFAULT 0,
    upvotes             INT DEFAULT 0,
    is_duplicate        BOOLEAN DEFAULT FALSE,
    duplicate_of        BIGINT,
    resolved_at         DATETIME,
    escalated_at        DATETIME,
    resolution_notes    TEXT,
    feedback_rating     TINYINT,
    feedback_comment    TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_officer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_category (category),
    INDEX idx_user (user_id),
    INDEX idx_officer (assigned_officer_id),
    INDEX idx_created (created_at),
    INDEX idx_number (complaint_number)
);

-- ─── Complaint Attachments ───────────────────────────────────
CREATE TABLE complaint_attachments (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    file_name    VARCHAR(255) NOT NULL,
    file_url     VARCHAR(500) NOT NULL,
    file_type    VARCHAR(50),
    file_size    BIGINT,
    uploaded_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    INDEX idx_complaint (complaint_id)
);

-- ─── Complaint Status History ────────────────────────────────
CREATE TABLE complaint_status_history (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id  BIGINT NOT NULL,
    status        ENUM('OPEN','PENDING','IN_PROGRESS','RESOLVED','CLOSED','ESCALATED') NOT NULL,
    remarks       TEXT,
    action        VARCHAR(100),
    updated_by_id BIGINT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_complaint (complaint_id)
);

-- ─── Notifications ───────────────────────────────────────────
CREATE TABLE notifications (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id              BIGINT NOT NULL,
    title                VARCHAR(200) NOT NULL,
    message              TEXT NOT NULL,
    type                 ENUM('INFO','SUCCESS','WARNING','ERROR') DEFAULT 'INFO',
    is_read              BOOLEAN DEFAULT FALSE,
    related_entity_type  VARCHAR(100),
    related_entity_id    BIGINT,
    action_url           VARCHAR(255),
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);

-- ─── Weather Data (cache) ────────────────────────────────────
CREATE TABLE weather_data (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    location    VARCHAR(100) NOT NULL,
    latitude    DECIMAL(10,8),
    longitude   DECIMAL(11,8),
    data        JSON NOT NULL,
    forecast    JSON,
    fetched_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (location)
);

-- ─── Crop Diseases ───────────────────────────────────────────
CREATE TABLE crop_diseases (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    crop            VARCHAR(100) NOT NULL,
    symptoms        TEXT,
    causes          TEXT,
    treatment       TEXT,
    prevention      TEXT,
    organic_remedy  TEXT,
    severity        ENUM('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_crop (crop)
);

-- ─── Disease Predictions (AI results) ───────────────────────
CREATE TABLE disease_predictions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    image_url       VARCHAR(500),
    disease_name    VARCHAR(100),
    confidence      DECIMAL(5,2),
    crop_name       VARCHAR(100),
    severity        ENUM('LOW','MEDIUM','HIGH'),
    ai_response     JSON,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- ─── Government Schemes ──────────────────────────────────────
CREATE TABLE schemes (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(200) NOT NULL,
    description      TEXT,
    benefit          VARCHAR(255),
    eligibility      TEXT,
    documents        TEXT,
    category         VARCHAR(50),
    state            VARCHAR(100) DEFAULT 'ALL',
    application_url  VARCHAR(255),
    helpline         VARCHAR(20),
    active           BOOLEAN DEFAULT TRUE,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_state (state)
);

-- ─── Community Votes ─────────────────────────────────────────
CREATE TABLE community_votes (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    user_id      BIGINT NOT NULL,
    vote_type    ENUM('UPVOTE','DOWNVOTE') DEFAULT 'UPVOTE',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_vote (complaint_id, user_id),
    INDEX idx_complaint (complaint_id)
);

-- ─── Mandi Prices ────────────────────────────────────────────
CREATE TABLE mandi_prices (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    crop_name   VARCHAR(100) NOT NULL,
    mandi_name  VARCHAR(100) NOT NULL,
    state       VARCHAR(100),
    district    VARCHAR(100),
    price       DECIMAL(10,2) NOT NULL,
    min_price   DECIMAL(10,2),
    max_price   DECIMAL(10,2),
    unit        VARCHAR(20) DEFAULT 'Quintal',
    price_date  DATE NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_crop (crop_name),
    INDEX idx_date (price_date),
    INDEX idx_mandi (mandi_name)
);

-- ─── Soil Reports ────────────────────────────────────────────
CREATE TABLE soil_reports (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    report_file_url VARCHAR(500),
    nitrogen        DECIMAL(6,2),
    phosphorus      DECIMAL(6,2),
    potassium       DECIMAL(6,2),
    ph_value        DECIMAL(4,2),
    organic_carbon  DECIMAL(5,2),
    health_score    INT,
    ai_analysis     TEXT,
    recommendations TEXT,
    suitable_crops  VARCHAR(500),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- ─── Loan Applications ───────────────────────────────────────
CREATE TABLE loan_applications (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL,
    loan_type        ENUM('KCC','CROP_LOAN','TERM_LOAN','MUDRA') NOT NULL,
    amount_requested DECIMAL(12,2),
    amount_approved  DECIMAL(12,2),
    interest_rate    DECIMAL(5,2),
    tenure_months    INT,
    bank_name        VARCHAR(100),
    status           ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','DISBURSED'),
    applied_at       DATETIME,
    approved_at      DATETIME,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

-- ─── Marketplace Listings ────────────────────────────────────
CREATE TABLE marketplace_listings (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    crop_name    VARCHAR(100),
    quantity     DECIMAL(10,2),
    unit         VARCHAR(20),
    price        DECIMAL(10,2),
    location     VARCHAR(200),
    images       TEXT,
    status       ENUM('ACTIVE','SOLD','EXPIRED','DRAFT') DEFAULT 'ACTIVE',
    expires_at   DATETIME,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_crop (crop_name),
    INDEX idx_status (status)
);

-- ─── Equipment Rentals ───────────────────────────────────────
CREATE TABLE equipment_rentals (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id        BIGINT NOT NULL,
    renter_id       BIGINT,
    equipment_name  VARCHAR(100) NOT NULL,
    equipment_type  VARCHAR(50),
    description     TEXT,
    daily_rate      DECIMAL(10,2),
    location        VARCHAR(200),
    available       BOOLEAN DEFAULT TRUE,
    booked_from     DATE,
    booked_to       DATE,
    status          ENUM('AVAILABLE','BOOKED','IN_USE','MAINTENANCE') DEFAULT 'AVAILABLE',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (renter_id) REFERENCES users(id),
    INDEX idx_owner (owner_id),
    INDEX idx_type (equipment_type)
);

-- ─── Farm Calendar Events ────────────────────────────────────
CREATE TABLE farm_calendar_events (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    event_type   ENUM('SOWING','IRRIGATION','FERTILIZER','HARVEST','PEST_CONTROL','OTHER'),
    event_date   DATE NOT NULL,
    reminder     BOOLEAN DEFAULT TRUE,
    crop_name    VARCHAR(100),
    ai_generated BOOLEAN DEFAULT FALSE,
    completed    BOOLEAN DEFAULT FALSE,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_date (event_date)
);

-- ─── Livestock Records ───────────────────────────────────────
CREATE TABLE livestock_records (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    animal_type     VARCHAR(50) NOT NULL,
    animal_name     VARCHAR(50),
    tag_number      VARCHAR(30),
    breed           VARCHAR(100),
    date_of_birth   DATE,
    gender          ENUM('MALE','FEMALE','UNKNOWN'),
    health_status   ENUM('HEALTHY','SICK','RECOVERING','DECEASED') DEFAULT 'HEALTHY',
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- ─── Livestock Vaccinations ──────────────────────────────────
CREATE TABLE livestock_vaccinations (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    animal_id       BIGINT NOT NULL,
    vaccine_name    VARCHAR(100) NOT NULL,
    administered_on DATE,
    next_due_date   DATE,
    administered_by VARCHAR(100),
    notes           TEXT,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES livestock_records(id) ON DELETE CASCADE,
    INDEX idx_animal (animal_id)
);

-- ─── Documents ───────────────────────────────────────────────
CREATE TABLE documents (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    title         VARCHAR(200) NOT NULL,
    document_type ENUM('LAND_RECORD','AADHAR','PAN','BANK','KCC','INSURANCE','OTHER'),
    file_url      VARCHAR(500) NOT NULL,
    file_name     VARCHAR(255),
    file_size     BIGINT,
    encrypted     BOOLEAN DEFAULT FALSE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_type (document_type)
);

-- ─── News Articles ───────────────────────────────────────────
CREATE TABLE news_articles (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(300) NOT NULL,
    content      TEXT NOT NULL,
    summary      TEXT,
    author       VARCHAR(100),
    category     ENUM('AGRICULTURE','WEATHER','SCHEME','MARKET','GENERAL') DEFAULT 'GENERAL',
    state        VARCHAR(100),
    district     VARCHAR(100),
    image_url    VARCHAR(500),
    source       VARCHAR(200),
    source_url   VARCHAR(500),
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    active       BOOLEAN DEFAULT TRUE,
    INDEX idx_category (category),
    INDEX idx_published (published_at),
    INDEX idx_district (district)
);

-- ─── SOS Requests ────────────────────────────────────────────
CREATE TABLE sos_requests (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    emergency_type VARCHAR(50) NOT NULL,
    description    TEXT,
    latitude       DECIMAL(10,8),
    longitude      DECIMAL(11,8),
    status         ENUM('TRIGGERED','ACKNOWLEDGED','RESOLVED') DEFAULT 'TRIGGERED',
    reference_id   VARCHAR(30) UNIQUE,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at    DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

-- ─── Chat History ────────────────────────────────────────────
CREATE TABLE chat_history (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    role       ENUM('user','assistant') NOT NULL,
    content    TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
);

-- ─── Audit Logs ──────────────────────────────────────────────
CREATE TABLE audit_logs (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT,
    action        VARCHAR(100) NOT NULL,
    entity_type   VARCHAR(50),
    entity_id     BIGINT,
    old_value     JSON,
    new_value     JSON,
    ip_address    VARCHAR(45),
    user_agent    VARCHAR(500),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);

-- ─── Escalation Logs ─────────────────────────────────────────
CREATE TABLE escalation_logs (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id     BIGINT NOT NULL,
    escalated_by_id  BIGINT,
    escalated_to_id  BIGINT,
    reason           TEXT,
    level            INT DEFAULT 1,
    status           ENUM('OPEN','RESOLVED') DEFAULT 'OPEN',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at      DATETIME,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (escalated_by_id) REFERENCES users(id),
    FOREIGN KEY (escalated_to_id) REFERENCES users(id),
    INDEX idx_complaint (complaint_id)
);

-- ─── Seed Data ───────────────────────────────────────────────
INSERT INTO users (full_name, email, mobile, password, role, village, district, state, email_verified, mobile_verified, active)
VALUES
('Ramesh Kumar Farmer', 'farmer@demo.com', '9876543210',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oGJVXpOHS', -- Demo@123
 'FARMER', 'Rahata', 'Ahmednagar', 'Maharashtra', TRUE, TRUE, TRUE),
('Priya Sharma Officer', 'officer@demo.com', '9876543211',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oGJVXpOHS',
 'OFFICER', NULL, 'Nashik', 'Maharashtra', TRUE, TRUE, TRUE),
('Super Admin', 'admin@demo.com', '9876543212',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oGJVXpOHS',
 'SUPER_ADMIN', NULL, 'Pune', 'Maharashtra', TRUE, TRUE, TRUE);

INSERT INTO schemes (name, description, benefit, eligibility, category, application_url, helpline) VALUES
('PM Kisan Samman Nidhi', 'Financial assistance to land-owning farmer families', '₹6,000/year in 3 installments', 'All land-owning farmer families', 'INCOME_SUPPORT', 'https://pmkisan.gov.in', '155261'),
('Pradhan Mantri Fasal Bima Yojana', 'Crop insurance scheme for farmers', 'Crop insurance coverage', 'All farmers with crop loans', 'INSURANCE', 'https://pmfby.gov.in', '1800-200-7710'),
('Kisan Credit Card', 'Short-term credit to farmers for crop cultivation', 'Credit up to ₹3 lakh @ 4% interest', 'Farmers with land records', 'CREDIT', 'https://agricoop.nic.in', NULL),
('PM Kusum Solar Pump', 'Subsidy on solar irrigation pumps', '60% subsidy on solar pump installation', 'Farmers without grid electricity', 'INFRASTRUCTURE', 'https://mnre.gov.in', NULL),
('Soil Health Card Scheme', 'Free soil testing and health cards for farmers', 'Free soil testing every 2 years', 'All farmers', 'SOIL', 'https://soilhealth.dac.gov.in', NULL);

INSERT INTO crop_diseases (name, crop, symptoms, causes, treatment, prevention, severity) VALUES
('Powdery Mildew', 'Wheat', 'White powdery spots on leaves and stems', 'Fungal — Blumeria graminis', 'Apply sulfur-based fungicide Sulfex 80WP at 2g/L; Propiconazole 25EC at 0.1%', 'Use resistant varieties; avoid overhead irrigation; improve air circulation', 'MEDIUM'),
('Yellow Rust', 'Wheat', 'Yellow striped pustules on leaves', 'Fungal — Puccinia striiformis', 'Propiconazole 25EC @ 0.1%; Tebuconazole 250EW @ 1ml/L', 'Grow resistant varieties; early sowing; crop rotation', 'HIGH'),
('Late Blight', 'Tomato', 'Dark brown lesions on leaves, white fungal growth on underside', 'Oomycete — Phytophthora infestans', 'Mancozeb 75WP @ 2g/L; Metalaxyl+Mancozeb @ 2.5g/L', 'Avoid excess moisture; remove infected plants; proper spacing', 'HIGH'),
('Bacterial Wilt', 'Tomato', 'Sudden wilting of plants, dark streaks in stem', 'Bacterial — Ralstonia solanacearum', 'No effective chemical cure; remove and destroy infected plants', 'Soil solarization; resistant varieties; crop rotation', 'HIGH');
