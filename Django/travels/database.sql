-- =====================================================
-- COMPLETE SQLITE3 DATABASE SCHEMA
-- =====================================================

BEGIN TRANSACTION;

-- =====================================================
-- DJANGO AUTHENTICATION AND CONTENT TYPES
-- =====================================================

-- Content types table
CREATE TABLE IF NOT EXISTS django_content_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE(app_label, model)
);

-- Permissions table
CREATE TABLE IF NOT EXISTS auth_permission (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    content_type_id INTEGER NOT NULL,
    codename VARCHAR(100) NOT NULL,
    FOREIGN KEY(content_type_id) REFERENCES django_content_type(id) ON DELETE CASCADE,
    UNIQUE(content_type_id, codename)
);

-- Groups table
CREATE TABLE IF NOT EXISTS auth_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(150) NOT NULL UNIQUE
);

-- Group permissions junction table
CREATE TABLE IF NOT EXISTS auth_group_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    FOREIGN KEY(group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    FOREIGN KEY(permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE(group_id, permission_id)
);

-- Users table
CREATE TABLE IF NOT EXISTS auth_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME,
    is_superuser BOOLEAN NOT NULL DEFAULT 0,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL DEFAULT '',
    is_staff BOOLEAN NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    date_joined DATETIME NOT NULL
);

-- User groups junction table
CREATE TABLE IF NOT EXISTS auth_user_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    FOREIGN KEY(group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    UNIQUE(user_id, group_id)
);

-- User permissions junction table
CREATE TABLE IF NOT EXISTS auth_user_user_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    FOREIGN KEY(permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE(user_id, permission_id)
);

-- =====================================================
-- DJANGO REST FRAMEWORK AUTH TOKEN
-- =====================================================

CREATE TABLE IF NOT EXISTS authtoken_token (
    key VARCHAR(40) PRIMARY KEY,
    created DATETIME NOT NULL,
    user_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY(user_id) REFERENCES auth_user(id) ON DELETE CASCADE
);

-- =====================================================
-- DJANGO SESSIONS AND MIGRATIONS
-- =====================================================

-- Sessions table
CREATE TABLE IF NOT EXISTS django_session (
    session_key VARCHAR(40) PRIMARY KEY,
    session_data TEXT NOT NULL,
    expire_date DATETIME NOT NULL
);

-- Migrations table
CREATE TABLE IF NOT EXISTS django_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied DATETIME NOT NULL
);

-- Admin log table
CREATE TABLE IF NOT EXISTS django_admin_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action_time DATETIME NOT NULL,
    object_id TEXT,
    object_repr VARCHAR(200) NOT NULL,
    action_flag SMALLINT NOT NULL,
    change_message TEXT NOT NULL,
    content_type_id INTEGER,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(content_type_id) REFERENCES django_content_type(id) ON DELETE SET NULL,
    FOREIGN KEY(user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    CHECK(action_flag IN (1, 2, 3))  -- 1=ADDITION, 2=CHANGE, 3=DELETION
);

-- =====================================================
-- BOOKINGS APP TABLES
-- =====================================================

-- Buses table (singular)
CREATE TABLE IF NOT EXISTS bookings_bus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_number VARCHAR(50) NOT NULL,
    bus_name VARCHAR(100),
    bus_type VARCHAR(50) DEFAULT 'Standard',
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    total_seats INTEGER NOT NULL CHECK(total_seats > 0),
    available_seats INTEGER NOT NULL,
    fare DECIMAL(10, 2) NOT NULL CHECK(fare >= 0),
    operator_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Alternative Buses table (plural) - use if your model is named 'Buses' instead of 'Bus'
CREATE TABLE IF NOT EXISTS bookings_buses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_number VARCHAR(50) NOT NULL,
    bus_name VARCHAR(100),
    bus_type VARCHAR(50) DEFAULT 'Standard',
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    total_seats INTEGER NOT NULL CHECK(total_seats > 0),
    available_seats INTEGER NOT NULL,
    fare DECIMAL(10, 2) NOT NULL CHECK(fare >= 0),
    operator_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seats table
CREATE TABLE IF NOT EXISTS bookings_seat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seat_number VARCHAR(10) NOT NULL,
    seat_type VARCHAR(20) DEFAULT 'Standard', -- e.g., Window, Aisle, Sleeper, Semi-Sleeper
    is_booked BOOLEAN NOT NULL DEFAULT 0,
    is_reserved BOOLEAN NOT NULL DEFAULT 0, -- for physically handicapped, ladies, etc.
    price DECIMAL(10, 2),
    bus_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(bus_id) REFERENCES bookings_bus(id) ON DELETE CASCADE,
    UNIQUE(bus_id, seat_number)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings_booking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference VARCHAR(20) NOT NULL UNIQUE, -- Unique booking reference number
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    travel_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    total_amount DECIMAL(10, 2) NOT NULL CHECK(total_amount >= 0),
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    payment_method VARCHAR(50),
    passenger_name VARCHAR(100) NOT NULL,
    passenger_email VARCHAR(254),
    passenger_phone VARCHAR(15) NOT NULL,
    passenger_age INTEGER,
    passenger_gender VARCHAR(10),
    number_of_seats INTEGER NOT NULL DEFAULT 1,
    special_requests TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    bus_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    FOREIGN KEY(bus_id) REFERENCES bookings_bus(id) ON DELETE RESTRICT,
    FOREIGN KEY(user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    FOREIGN KEY(seat_id) REFERENCES bookings_seat(id) ON DELETE RESTRICT
);

-- =====================================================
-- OPTIONAL: ADDITIONAL TABLES FOR COMPLETE BOOKING SYSTEM
-- =====================================================

-- Bus operators table (optional)
CREATE TABLE IF NOT EXISTS bookings_operator (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    contact_person VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(254),
    address TEXT,
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Routes table (optional)
CREATE TABLE IF NOT EXISTS bookings_route (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance DECIMAL(10, 2), -- in kilometers
    estimated_duration INTEGER, -- in minutes
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source, destination)
);

-- Reviews table (optional)
CREATE TABLE IF NOT EXISTS bookings_review (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    booking_id INTEGER NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    bus_id INTEGER NOT NULL,
    FOREIGN KEY(booking_id) REFERENCES bookings_booking(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    FOREIGN KEY(bus_id) REFERENCES bookings_bus(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Indexes for auth tables
CREATE INDEX IF NOT EXISTS idx_auth_user_username ON auth_user(username);
CREATE INDEX IF NOT EXISTS idx_auth_user_email ON auth_user(email);
CREATE INDEX IF NOT EXISTS idx_auth_user_is_active ON auth_user(is_active);
CREATE INDEX IF NOT EXISTS idx_auth_permission_codename ON auth_permission(codename);

-- Indexes for session table
CREATE INDEX IF NOT EXISTS idx_django_session_expire_date ON django_session(expire_date);

-- Indexes for bookings_bus table
CREATE INDEX IF NOT EXISTS idx_bookings_bus_number ON bookings_bus(bus_number);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_source ON bookings_bus(source);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_destination ON bookings_bus(destination);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_source_destination ON bookings_bus(source, destination);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_departure_time ON bookings_bus(departure_time);
CREATE INDEX IF NOT EXISTS idx_bookings_bus_is_active ON bookings_bus(is_active);

-- Indexes for bookings_booking table
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings_booking(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_user_id ON bookings_booking(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_bus_id ON bookings_booking(bus_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_travel_date ON bookings_booking(travel_date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON bookings_booking(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_payment_status ON bookings_booking(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_phone ON bookings_booking(passenger_phone);

-- Indexes for bookings_seat table
CREATE INDEX IF NOT EXISTS idx_bookings_seat_bus_id ON bookings_seat(bus_id);
CREATE INDEX IF NOT EXISTS idx_bookings_seat_is_booked ON bookings_seat(is_booked);
CREATE INDEX IF NOT EXISTS idx_bookings_seat_bus_seat ON bookings_seat(bus_id, seat_number);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update available_seats when a seat is booked
CREATE TRIGGER IF NOT EXISTS update_available_seats_after_booking
AFTER INSERT ON bookings_booking
BEGIN
    UPDATE bookings_bus 
    SET available_seats = available_seats - NEW.number_of_seats,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.bus_id;
END;

-- Trigger to update available_seats when a booking is cancelled
CREATE TRIGGER IF NOT EXISTS update_available_seats_after_cancellation
AFTER UPDATE OF status ON bookings_booking
WHEN NEW.status = 'cancelled' AND OLD.status != 'cancelled'
BEGIN
    UPDATE bookings_bus 
    SET available_seats = available_seats + OLD.number_of_seats,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.bus_id;
    
    UPDATE bookings_seat 
    SET is_booked = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.seat_id;
END;

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_bookings_bus_timestamp
AFTER UPDATE ON bookings_bus
BEGIN
    UPDATE bookings_bus SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_bookings_booking_timestamp
AFTER UPDATE ON bookings_booking
BEGIN
    UPDATE bookings_booking SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_bookings_seat_timestamp
AFTER UPDATE ON bookings_seat
BEGIN
    UPDATE bookings_seat SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- =====================================================
-- SAMPLE INITIAL DATA (OPTIONAL)
-- =====================================================

-- Insert initial content types
INSERT OR IGNORE INTO django_content_type (app_label, model) VALUES 
    ('auth', 'permission'),
    ('auth', 'group'),
    ('auth', 'user'),
    ('authtoken', 'token'),
    ('bookings', 'bus'),
    ('bookings', 'seat'),
    ('bookings', 'booking');

-- Insert default permissions (simplified - Django normally does this automatically)
INSERT OR IGNORE INTO auth_permission (name, content_type_id, codename) VALUES
    ('Can add permission', 1, 'add_permission'),
    ('Can change permission', 1, 'change_permission'),
    ('Can delete permission', 1, 'delete_permission'),
    ('Can view permission', 1, 'view_permission'),
    ('Can add group', 2, 'add_group'),
    ('Can change group', 2, 'change_group'),
    ('Can delete group', 2, 'delete_group'),
    ('Can view group', 2, 'view_group'),
    ('Can add user', 3, 'add_user'),
    ('Can change user', 3, 'change_user'),
    ('Can delete user', 3, 'delete_user'),
    ('Can view user', 3, 'view_user');

-- Insert sample bus data (optional)
INSERT OR IGNORE INTO bookings_bus 
    (bus_number, bus_name, source, destination, departure_time, arrival_time, total_seats, available_seats, fare, operator_name) 
VALUES 
    ('EXP1001', 'Express Deluxe', 'New York', 'Boston', '2024-01-15 08:00:00', '2024-01-15 12:30:00', 40, 40, 45.50, 'Express Travels'),
    ('EXP1002', 'Luxury Liner', 'Boston', 'New York', '2024-01-15 14:00:00', '2024-01-15 18:30:00', 40, 38, 45.50, 'Express Travels'),
    ('CITY2001', 'City Rider', 'Los Angeles', 'San Diego', '2024-01-15 09:00:00', '2024-01-15 11:30:00', 30, 30, 25.00, 'City Bus Lines');

-- Insert sample seats for bus ID 1
INSERT OR IGNORE INTO bookings_seat (seat_number, bus_id, price)
SELECT 'A' || printf('%02d', number), 1, 45.50
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<20)
    SELECT x as number FROM cnt
);

-- Insert sample seats for bus ID 2
INSERT OR IGNORE INTO bookings_seat (seat_number, bus_id, price)
SELECT 'B' || printf('%02d', number), 2, 45.50
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<20)
    SELECT x as number FROM cnt
);

-- Insert sample seats for bus ID 3
INSERT OR IGNORE INTO bookings_seat (seat_number, bus_id, price)
SELECT 'C' || printf('%02d', number), 3, 25.00
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<15)
    SELECT x as number FROM cnt
);

COMMIT;

-- =====================================================
-- DATABASE VERIFICATION QUERIES
-- =====================================================

-- Run these queries to verify your database setup
/*
-- Check all tables
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- Check all indexes
SELECT name FROM sqlite_master WHERE type='index' ORDER BY name;

-- Check triggers
SELECT name FROM sqlite_master WHERE type='trigger' ORDER BY name;

-- Get table info for bookings_booking
PRAGMA table_info(bookings_booking);

-- Get foreign key list for bookings_booking
PRAGMA foreign_key_list(bookings_booking);

-- Get index list for bookings_booking
PRAGMA index_list(bookings_booking);
*/

-- Enable foreign keys enforcement
PRAGMA foreign_keys = ON;










-- =====================================================
-- INSERT SAMPLE DATA FOR ALL TABLES
-- =====================================================

BEGIN TRANSACTION;

-- =====================================================
-- 1. INSERT INTO django_content_type
-- =====================================================
INSERT OR IGNORE INTO django_content_type (app_label, model) VALUES 
    ('auth', 'permission'),
    ('auth', 'group'),
    ('auth', 'user'),
    ('admin', 'logentry'),
    ('sessions', 'session'),
    ('authtoken', 'token'),
    ('bookings', 'bus'),
    ('bookings', 'buses'),
    ('bookings', 'seat'),
    ('bookings', 'booking'),
    ('bookings', 'operator'),
    ('bookings', 'route'),
    ('bookings', 'review');

-- =====================================================
-- 2. INSERT INTO auth_permission
-- =====================================================
INSERT OR IGNORE INTO auth_permission (name, content_type_id, codename) VALUES
    -- Auth permissions (content_type_id = 1)
    ('Can add permission', 1, 'add_permission'),
    ('Can change permission', 1, 'change_permission'),
    ('Can delete permission', 1, 'delete_permission'),
    ('Can view permission', 1, 'view_permission'),
    
    -- Group permissions (content_type_id = 2)
    ('Can add group', 2, 'add_group'),
    ('Can change group', 2, 'change_group'),
    ('Can delete group', 2, 'delete_group'),
    ('Can view group', 2, 'view_group'),
    
    -- User permissions (content_type_id = 3)
    ('Can add user', 3, 'add_user'),
    ('Can change user', 3, 'change_user'),
    ('Can delete user', 3, 'delete_user'),
    ('Can view user', 3, 'view_user'),
    
    -- Admin log permissions (content_type_id = 4)
    ('Can add log entry', 4, 'add_logentry'),
    ('Can change log entry', 4, 'change_logentry'),
    ('Can delete log entry', 4, 'delete_logentry'),
    ('Can view log entry', 4, 'view_logentry'),
    
    -- Session permissions (content_type_id = 5)
    ('Can add session', 5, 'add_session'),
    ('Can change session', 5, 'change_session'),
    ('Can delete session', 5, 'delete_session'),
    ('Can view session', 5, 'view_session'),
    
    -- Token permissions (content_type_id = 6)
    ('Can add token', 6, 'add_token'),
    ('Can change token', 6, 'change_token'),
    ('Can delete token', 6, 'delete_token'),
    ('Can view token', 6, 'view_token'),
    
    -- Bus permissions (content_type_id = 7)
    ('Can add bus', 7, 'add_bus'),
    ('Can change bus', 7, 'change_bus'),
    ('Can delete bus', 7, 'delete_bus'),
    ('Can view bus', 7, 'view_bus'),
    
    -- Seat permissions (content_type_id = 9)
    ('Can add seat', 9, 'add_seat'),
    ('Can change seat', 9, 'change_seat'),
    ('Can delete seat', 9, 'delete_seat'),
    ('Can view seat', 9, 'view_seat'),
    
    -- Booking permissions (content_type_id = 10)
    ('Can add booking', 10, 'add_booking'),
    ('Can change booking', 10, 'change_booking'),
    ('Can delete booking', 10, 'delete_booking'),
    ('Can view booking', 10, 'view_booking');

-- =====================================================
-- 3. INSERT INTO auth_group
-- =====================================================
INSERT OR IGNORE INTO auth_group (name) VALUES 
    ('Administrators'),
    ('Bus Operators'),
    ('Customers'),
    ('Support Staff'),
    ('Managers');

-- =====================================================
-- 4. INSERT INTO auth_group_permissions
-- =====================================================
-- Administrators get all permissions
INSERT OR IGNORE INTO auth_group_permissions (group_id, permission_id)
SELECT 1, id FROM auth_permission;

-- Bus Operators get bus and booking permissions
INSERT OR IGNORE INTO auth_group_permissions (group_id, permission_id)
SELECT 2, id FROM auth_permission 
WHERE codename LIKE '%bus' OR codename LIKE '%booking' OR codename LIKE '%seat';

-- Customers get view permissions only
INSERT OR IGNORE INTO auth_group_permissions (group_id, permission_id)
SELECT 3, id FROM auth_permission 
WHERE codename LIKE 'view_%';

-- =====================================================
-- 5. INSERT INTO auth_user
-- =====================================================
-- Passwords are hashed using Django's default hasher
-- Password for all users is 'password123' (hashed)
INSERT OR IGNORE INTO auth_user (
    password, last_login, is_superuser, username, first_name, last_name, 
    email, is_staff, is_active, date_joined
) VALUES 
    -- Super Admin
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-15 10:30:00', 1, 'admin', 'Admin', 'User', 'admin@travels.com', 1, 1, '2024-01-01 09:00:00'),
    
    -- Staff Users
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-15 09:15:00', 0, 'john_doe', 'John', 'Doe', 'john@travels.com', 1, 1, '2024-01-02 10:00:00'),
    
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-14 14:20:00', 0, 'jane_smith', 'Jane', 'Smith', 'jane@travels.com', 1, 1, '2024-01-02 11:30:00'),
    
    -- Regular Customers
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-15 08:45:00', 0, 'robert_johnson', 'Robert', 'Johnson', 'robert@gmail.com', 0, 1, '2024-01-05 15:20:00'),
    
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-14 18:30:00', 0, 'emily_williams', 'Emily', 'Williams', 'emily@yahoo.com', 0, 1, '2024-01-06 09:45:00'),
    
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     NULL, 0, 'michael_brown', 'Michael', 'Brown', 'michael@gmail.com', 0, 1, '2024-01-07 13:15:00'),
    
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-13 11:10:00', 0, 'sarah_davis', 'Sarah', 'Davis', 'sarah@gmail.com', 0, 1, '2024-01-08 10:00:00'),
    
    -- Bus Operators
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-15 07:30:00', 0, 'express_travels', 'Express', 'Travels', 'contact@expresstravels.com', 0, 1, '2024-01-03 08:00:00'),
    
    ('pbkdf2_sha256$260000$4Z1iQy3nX5sH$mB3Uq7K8xR9pL2yW5nJ4cV6aF8bG9kM0nS1tR2vX4zY=', 
     '2024-01-14 16:45:00', 0, 'city_bus', 'City', 'Bus', 'info@citybus.com', 0, 1, '2024-01-03 09:15:00');

-- =====================================================
-- 6. INSERT INTO auth_user_groups
-- =====================================================
INSERT OR IGNORE INTO auth_user_groups (user_id, group_id) VALUES
    (1, 1), -- admin in Administrators
    (2, 5), -- john_doe in Managers
    (3, 4), -- jane_smith in Support Staff
    (4, 3), -- robert_johnson in Customers
    (5, 3), -- emily_williams in Customers
    (6, 3), -- michael_brown in Customers
    (7, 3), -- sarah_davis in Customers
    (8, 2), -- express_travels in Bus Operators
    (9, 2); -- city_bus in Bus Operators

-- =====================================================
-- 7. INSERT INTO auth_user_user_permissions
-- =====================================================
-- Give specific permissions to certain users
INSERT OR IGNORE INTO auth_user_user_permissions (user_id, permission_id) VALUES
    (2, 33), -- john_doe can add bus
    (2, 34), -- john_doe can change bus
    (3, 37), -- jane_smith can add booking
    (3, 38); -- jane_smith can change booking

-- =====================================================
-- 8. INSERT INTO authtoken_token
-- =====================================================
INSERT OR IGNORE INTO authtoken_token (key, created, user_id) VALUES
    ('1234567890abcdef1234567890abcdef12345678', '2024-01-15 10:30:00', 1),
    ('2345678901abcdef2345678901abcdef23456789', '2024-01-15 09:15:00', 2),
    ('3456789012abcdef3456789012abcdef34567890', '2024-01-14 14:20:00', 3),
    ('4567890123abcdef4567890123abcdef45678901', '2024-01-15 08:45:00', 4),
    ('5678901234abcdef5678901234abcdef56789012', '2024-01-14 18:30:00', 5);

-- =====================================================
-- 9. INSERT INTO django_session
-- =====================================================
INSERT OR IGNORE INTO django_session (session_key, session_data, expire_date) VALUES
    ('abc123def456ghi789jkl012mno345pqr678stu', 'eyJ1c2VyX2lkIjoxLCJzZXNzaW9uX2RhdGEiOiJzYW1wbGVfZGF0YSJ9', '2024-01-30 10:30:00'),
    ('def456ghi789jkl012mno345pqr678stu901vwx', 'eyJ1c2VyX2lkIjoyLCJzZXNzaW9uX2RhdGEiOiJzYW1wbGVfZGF0YV8yIn0=', '2024-01-29 09:15:00'),
    ('ghi789jkl012mno345pqr678stu901vwx234yza', 'eyJ1c2VyX2lkIjozLCJzZXNzaW9uX2RhdGEiOiJzYW1wbGVfZGF0YV8zIn0=', '2024-01-28 14:20:00');

-- =====================================================
-- 10. INSERT INTO django_migrations
-- =====================================================
INSERT OR IGNORE INTO django_migrations (app, name, applied) VALUES
    ('contenttypes', '0001_initial', '2024-01-01 10:00:00'),
    ('auth', '0001_initial', '2024-01-01 10:01:00'),
    ('auth', '0002_alter_permission_name_max_length', '2024-01-01 10:01:05'),
    ('auth', '0003_alter_user_email_max_length', '2024-01-01 10:01:10'),
    ('auth', '0004_alter_user_username_opts', '2024-01-01 10:01:15'),
    ('auth', '0005_alter_user_last_login_null', '2024-01-01 10:01:20'),
    ('auth', '0006_require_contenttypes_0002', '2024-01-01 10:01:25'),
    ('auth', '0007_alter_validators_add_error_messages', '2024-01-01 10:01:30'),
    ('auth', '0008_alter_user_username_max_length', '2024-01-01 10:01:35'),
    ('auth', '0009_alter_user_last_name_max_length', '2024-01-01 10:01:40'),
    ('auth', '0010_alter_group_name_max_length', '2024-01-01 10:01:45'),
    ('auth', '0011_update_proxy_permissions', '2024-01-01 10:01:50'),
    ('auth', '0012_alter_user_first_name_max_length', '2024-01-01 10:01:55'),
    ('sessions', '0001_initial', '2024-01-01 10:02:00'),
    ('authtoken', '0001_initial', '2024-01-01 10:02:30'),
    ('authtoken', '0002_auto_20160226_1747', '2024-01-01 10:02:35'),
    ('authtoken', '0003_tokenproxy', '2024-01-01 10:02:40'),
    ('bookings', '0001_initial', '2024-01-02 09:00:00'),
    ('bookings', '0002_alter_booking_status', '2024-01-02 09:05:00'),
    ('bookings', '0003_booking_booking_reference', '2024-01-02 09:10:00');

-- =====================================================
-- 11. INSERT INTO django_admin_log
-- =====================================================
INSERT OR IGNORE INTO django_admin_log (action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) VALUES
    ('2024-01-02 09:15:00', '1', 'Express Deluxe Bus', 1, 'Added bus EXP1001', 7, 1),
    ('2024-01-02 09:16:00', '2', 'Luxury Liner Bus', 1, 'Added bus EXP1002', 7, 1),
    ('2024-01-02 09:17:00', '3', 'City Rider Bus', 1, 'Added bus CITY2001', 7, 1),
    ('2024-01-03 10:00:00', '1', 'admin user', 2, 'Changed superuser status', 3, 1),
    ('2024-01-05 14:30:00', '4', 'robert_johnson user', 1, 'Added user', 3, 1),
    ('2024-01-10 11:20:00', '1', 'Booking #BK001', 2, 'Changed status to confirmed', 10, 2);

-- =====================================================
-- 12. INSERT INTO bookings_bus
-- =====================================================
INSERT OR IGNORE INTO bookings_bus (
    bus_number, bus_name, bus_type, source, destination, 
    departure_time, arrival_time, total_seats, available_seats, 
    fare, operator_name, is_active
) VALUES 
    -- Express Travels Buses
    ('EXP1001', 'Express Deluxe', 'AC Sleeper', 'New York', 'Boston', 
     '2024-02-15 08:00:00', '2024-02-15 12:30:00', 40, 35, 45.50, 'Express Travels', 1),
    
    ('EXP1002', 'Luxury Liner', 'AC Seater', 'Boston', 'New York', 
     '2024-02-15 14:00:00', '2024-02-15 18:30:00', 40, 38, 45.50, 'Express Travels', 1),
    
    ('EXP1003', 'Night Rider', 'AC Sleeper', 'New York', 'Washington DC', 
     '2024-02-15 22:00:00', '2024-02-16 06:00:00', 36, 36, 65.00, 'Express Travels', 1),
    
    ('EXP1004', 'Morning Star', 'Non-AC Seater', 'Boston', 'Philadelphia', 
     '2024-02-16 06:30:00', '2024-02-16 12:00:00', 45, 45, 35.00, 'Express Travels', 1),
    
    -- City Bus Lines
    ('CITY2001', 'City Rider', 'AC Seater', 'Los Angeles', 'San Diego', 
     '2024-02-15 09:00:00', '2024-02-15 11:30:00', 30, 28, 25.00, 'City Bus Lines', 1),
    
    ('CITY2002', 'Coast Liner', 'AC Sleeper', 'San Francisco', 'Los Angeles', 
     '2024-02-15 20:00:00', '2024-02-16 06:00:00', 32, 30, 55.00, 'City Bus Lines', 1),
    
    ('CITY2003', 'Valley Express', 'Non-AC Seater', 'San Diego', 'Phoenix', 
     '2024-02-16 07:00:00', '2024-02-16 14:00:00', 40, 40, 40.00, 'City Bus Lines', 1),
    
    -- Metro Transport
    ('METR3001', 'Metro Liner', 'AC Sleeper', 'Chicago', 'Detroit', 
     '2024-02-15 21:00:00', '2024-02-16 05:00:00', 36, 34, 48.50, 'Metro Transport', 1),
    
    ('METR3002', 'Windy City Express', 'AC Seater', 'Chicago', 'Milwaukee', 
     '2024-02-15 10:00:00', '2024-02-15 12:15:00', 30, 29, 22.00, 'Metro Transport', 1),
    
    ('METR3003', 'Great Lakes', 'Non-AC Seater', 'Detroit', 'Cleveland', 
     '2024-02-16 08:30:00', '2024-02-16 11:45:00', 40, 40, 28.00, 'Metro Transport', 1);

-- =====================================================
-- 13. INSERT INTO bookings_seat
-- =====================================================
-- Generate seats for all buses
-- Bus 1: 40 seats (A01-A40)
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'A' || printf('%02d', number), 
       CASE WHEN number % 2 = 0 THEN 'Window' ELSE 'Aisle' END,
       0, 
       CASE WHEN number IN (5, 6, 15, 16, 25, 26) THEN 1 ELSE 0 END,
       45.50, 1
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<40)
    SELECT x as number FROM cnt
);

-- Bus 2: 40 seats (B01-B40) - some booked
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'B' || printf('%02d', number),
       CASE WHEN number % 2 = 0 THEN 'Window' ELSE 'Aisle' END,
       CASE WHEN number IN (1, 2, 3, 4, 5) THEN 1 ELSE 0 END,
       CASE WHEN number IN (8, 9, 18, 19, 28, 29) THEN 1 ELSE 0 END,
       45.50, 2
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<40)
    SELECT x as number FROM cnt
);

-- Bus 3: 36 seats (C01-C36) - Night Rider
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'C' || printf('%02d', number),
       CASE 
           WHEN number <= 18 THEN 'Sleeper - Lower'
           ELSE 'Sleeper - Upper'
       END,
       0,
       CASE WHEN number IN (10, 11, 12) THEN 1 ELSE 0 END,
       65.00, 3
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<36)
    SELECT x as number FROM cnt
);

-- Bus 4: 45 seats (D01-D45)
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'D' || printf('%02d', number),
       CASE WHEN number % 2 = 0 THEN 'Window' ELSE 'Aisle' END,
       0, 0, 35.00, 4
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<45)
    SELECT x as number FROM cnt
);

-- Bus 5: 30 seats (E01-E30) - City Rider - some booked
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'E' || printf('%02d', number),
       CASE WHEN number % 2 = 0 THEN 'Window' ELSE 'Aisle' END,
       CASE WHEN number IN (1, 2, 3) THEN 1 ELSE 0 END,
       0, 25.00, 5
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<30)
    SELECT x as number FROM cnt
);

-- Bus 6: 32 seats (F01-F32) - Coast Liner - some booked
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'F' || printf('%02d', number),
       CASE 
           WHEN number <= 16 THEN 'Sleeper - Lower'
           ELSE 'Sleeper - Upper'
       END,
       CASE WHEN number IN (5, 6, 7, 8) THEN 1 ELSE 0 END,
       CASE WHEN number IN (1, 2) THEN 1 ELSE 0 END,
       55.00, 6
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<32)
    SELECT x as number FROM cnt
);

-- Bus 7: 40 seats (G01-G40)
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'G' || printf('%02d', number),
       CASE WHEN number % 2 = 0 THEN 'Window' ELSE 'Aisle' END,
       0, 0, 40.00, 7
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<40)
    SELECT x as number FROM cnt
);

-- Bus 8: 36 seats (H01-H36) - Metro Liner - some booked
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'H' || printf('%02d', number),
       CASE 
           WHEN number <= 18 THEN 'Sleeper - Lower'
           ELSE 'Sleeper - Upper'
       END,
       CASE WHEN number IN (2, 4, 6, 8, 10) THEN 1 ELSE 0 END,
       CASE WHEN number IN (1, 3) THEN 1 ELSE 0 END,
       48.50, 8
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<36)
    SELECT x as number FROM cnt
);

-- Bus 9: 30 seats (I01-I30) - Windy City Express
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'I' || printf('%02d', number),
       CASE WHEN number % 2 = 0 THEN 'Window' ELSE 'Aisle' END,
       CASE WHEN number = 1 THEN 1 ELSE 0 END,
       0, 22.00, 9
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<30)
    SELECT x as number FROM cnt
);

-- Bus 10: 40 seats (J01-J40)
INSERT OR IGNORE INTO bookings_seat (seat_number, seat_type, is_booked, is_reserved, price, bus_id)
SELECT 'J' || printf('%02d', number),
       CASE WHEN number % 2 = 0 THEN 'Window' ELSE 'Aisle' END,
       0, 0, 28.00, 10
FROM (
    WITH RECURSIVE cnt(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM cnt WHERE x<40)
    SELECT x as number FROM cnt
);

-- =====================================================
-- 14. INSERT INTO bookings_booking
-- =====================================================
INSERT OR IGNORE INTO bookings_booking (
    booking_reference, booking_date, travel_date, status, total_amount,
    payment_status, payment_method, passenger_name, passenger_email,
    passenger_phone, passenger_age, passenger_gender, number_of_seats,
    special_requests, bus_id, user_id, seat_id
) VALUES
    -- Booking 1: Confirmed booking for Express Deluxe
    ('BK001', '2024-01-10 10:30:00', '2024-02-15 08:00:00', 'confirmed', 45.50,
     'completed', 'credit_card', 'Robert Johnson', 'robert@gmail.com',
     '+1234567890', 35, 'Male', 1,
     'Vegetarian meal preference', 1, 4, 5),
    
    -- Booking 2: Pending booking for Luxury Liner
    ('BK002', '2024-01-12 14:15:00', '2024-02-15 14:00:00', 'pending', 91.00,
     'pending', 'paypal', 'Emily Williams', 'emily@yahoo.com',
     '+1234567891', 28, 'Female', 2,
     'Prefer window seats together', 2, 5, 45),
    
    -- Booking 3: Confirmed for City Rider
    ('BK003', '2024-01-11 09:45:00', '2024-02-15 09:00:00', 'confirmed', 25.00,
     'completed', 'debit_card', 'Michael Brown', 'michael@gmail.com',
     '+1234567892', 42, 'Male', 1,
     NULL, 5, 6, 125),
    
    -- Booking 4: Cancelled booking
    ('BK004', '2024-01-08 16:20:00', '2024-02-15 20:00:00', 'cancelled', 55.00,
     'refunded', 'credit_card', 'Sarah Davis', 'sarah@gmail.com',
     '+1234567893', 31, 'Female', 1,
     'Lower berth requested', 6, 7, 165),
    
    -- Booking 5: Completed journey (past date)
    ('BK005', '2024-01-05 11:00:00', '2024-01-20 08:00:00', 'completed', 45.50,
     'completed', 'credit_card', 'John Doe', 'john@travels.com',
     '+1234567894', 45, 'Male', 1,
     NULL, 1, 2, 10),
    
    -- Booking 6: Confirmed for Metro Liner
    ('BK006', '2024-01-13 13:30:00', '2024-02-15 21:00:00', 'confirmed', 97.00,
     'completed', 'credit_card', 'Jane Smith', 'jane@travels.com',
     '+1234567895', 29, 'Female', 2,
     'Upper berths preferred', 8, 3, 245),
    
    -- Booking 7: Pending for Night Rider
    ('BK007', '2024-01-14 08:00:00', '2024-02-15 22:00:00', 'pending', 65.00,
     'pending', 'bank_transfer', 'Robert Johnson', 'robert@gmail.com',
     '+1234567890', 35, 'Male', 1,
     NULL, 3, 4, 85),
    
    -- Booking 8: Confirmed for Morning Star
    ('BK008', '2024-01-15 09:00:00', '2024-02-16 06:30:00', 'confirmed', 70.00,
     'completed', 'paypal', 'Emily Williams', 'emily@yahoo.com',
     '+1234567891', 28, 'Female', 2,
     'Need extra luggage space', 4, 5, 120),
    
    -- Booking 9: Confirmed for Valley Express
    ('BK009', '2024-01-14 15:45:00', '2024-02-16 07:00:00', 'confirmed', 40.00,
     'completed', 'credit_card', 'Michael Brown', 'michael@gmail.com',
     '+1234567892', 42, 'Male', 1,
     NULL, 7, 6, 235),
    
    -- Booking 10: Pending for Great Lakes
    ('BK010', '2024-01-15 11:20:00', '2024-02-16 08:30:00', 'pending', 28.00,
     'pending', 'debit_card', 'Sarah Davis', 'sarah@gmail.com',
     '+1234567893', 31, 'Female', 1,
     'Window seat preferred', 10, 7, 325);

-- =====================================================
-- 15. INSERT INTO bookings_operator (OPTIONAL)
-- =====================================================
INSERT OR IGNORE INTO bookings_operator (
    name, contact_person, phone, email, address, commission_rate, is_active
) VALUES
    ('Express Travels', 'Michael Express', '+1122334455', 'contact@expresstravels.com', 
     '123 Bus Terminal, New York, NY 10001', 5.00, 1),
    
    ('City Bus Lines', 'Sarah City', '+1223344556', 'info@citybus.com', 
     '456 Transit Hub, Los Angeles, CA 90001', 4.50, 1),
    
    ('Metro Transport', 'David Metro', '+1334455667', 'operations@metrotransport.com', 
     '789 Central Station, Chicago, IL 60601', 5.50, 1),
    
    ('Coast Express', 'Jennifer Coast', '+1445566778', 'bookings@coastexpress.com', 
     '321 Bay Terminal, San Francisco, CA 94101', 4.75, 1),
    
    ('Sunset Tours', 'Robert Sunset', '+1556677889', 'travel@settours.com', 
     '654 Sunset Blvd, Los Angeles, CA 90001', 5.25, 1);

-- =====================================================
-- 16. INSERT INTO bookings_route (OPTIONAL)
-- =====================================================
INSERT OR IGNORE INTO bookings_route (source, destination, distance, estimated_duration, is_active) VALUES
    ('New York', 'Boston', 306, 270, 1),
    ('Boston', 'New York', 306, 270, 1),
    ('New York', 'Washington DC', 225, 240, 1),
    ('Boston', 'Philadelphia', 310, 330, 1),
    ('Los Angeles', 'San Diego', 120, 150, 1),
    ('San Francisco', 'Los Angeles', 383, 360, 1),
    ('San Diego', 'Phoenix', 355, 420, 1),
    ('Chicago', 'Detroit', 283, 300, 1),
    ('Chicago', 'Milwaukee', 92, 135, 1),
    ('Detroit', 'Cleveland', 169, 195, 1),
    ('New York', 'Philadelphia', 95, 120, 1),
    ('Washington DC', 'Baltimore', 40, 60, 1),
    ('Seattle', 'Portland', 174, 210, 1),
    ('Miami', 'Orlando', 236, 240, 1),
    ('Dallas', 'Houston', 240, 270, 1);

-- =====================================================
-- 17. INSERT INTO bookings_review (OPTIONAL)
-- =====================================================
INSERT OR IGNORE INTO bookings_review (rating, comment, created_at, booking_id, user_id, bus_id) VALUES
    (5, 'Excellent service! Very comfortable seats and on-time departure.', 
     '2024-01-21 14:30:00', 5, 2, 1),
    
    (4, 'Good experience overall. Clean bus and professional driver.', 
     '2024-01-22 10:15:00', 3, 6, 5),
    
    (5, 'Amazing journey! The sleeper bus was very comfortable.', 
     '2024-01-23 09:45:00', 4, 7, 6),
    
    (3, 'Average experience. Bus was a bit late, but seats were comfortable.', 
     '2024-01-24 16:20:00', 5, 2, 1),
    
    (4, 'Good value for money. Would recommend.', 
     '2024-01-25 11:30:00', 5, 2, 1);

-- =====================================================
-- UPDATE available_seats based on bookings
-- =====================================================
UPDATE bookings_bus SET available_seats = total_seats - (
    SELECT COALESCE(SUM(number_of_seats), 0) 
    FROM bookings_booking 
    WHERE bookings_booking.bus_id = bookings_bus.id 
    AND status IN ('confirmed', 'pending', 'completed')
);

-- =====================================================
-- UPDATE is_booked status for seats that are booked
-- =====================================================
UPDATE bookings_seat SET is_booked = 1 
WHERE id IN (
    SELECT seat_id FROM bookings_booking 
    WHERE status IN ('confirmed', 'pending', 'completed')
);

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
/*
-- Check counts
SELECT 'auth_user' as table_name, COUNT(*) as row_count FROM auth_user UNION ALL
SELECT 'auth_group', COUNT(*) FROM auth_group UNION ALL
SELECT 'auth_permission', COUNT(*) FROM auth_permission UNION ALL
SELECT 'bookings_bus', COUNT(*) FROM bookings_bus UNION ALL
SELECT 'bookings_seat', COUNT(*) FROM bookings_seat UNION ALL
SELECT 'bookings_booking', COUNT(*) FROM bookings_booking UNION ALL
SELECT 'django_content_type', COUNT(*) FROM django_content_type UNION ALL
SELECT 'django_migrations', COUNT(*) FROM django_migrations UNION ALL
SELECT 'authtoken_token', COUNT(*) FROM authtoken_token;

-- Show sample data
SELECT * FROM auth_user LIMIT 3;
SELECT * FROM bookings_bus LIMIT 3;
SELECT * FROM bookings_booking LIMIT 3;
SELECT * FROM bookings_review LIMIT 3;
*/