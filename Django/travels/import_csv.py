"""
Script to import APSRTC Transport CSV data into SQLite3 database
- Fast bulk import using transactions
- Fixes data issues properly
- Does not modify other files
"""

import csv
import sqlite3
import os
from datetime import datetime

# Paths
CSV_FILE = os.path.join(os.path.dirname(__file__), 'APSRTC_Transport_Db.csv')
DB_FILE = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

def parse_date(date_str):
    """Parse date from DD-MM-YYYY format to YYYY-MM-DD for SQLite"""
    try:
        # Handle DD-MM-YYYY format
        dt = datetime.strptime(date_str.strip(), '%d-%m-%Y')
        return dt.strftime('%Y-%m-%d')
    except ValueError:
        # Return None for invalid dates
        return None

def validate_and_fix_record(record):
    """Validate and fix a single CSV record"""
    issues = []
    
    # Fix bus_id - ensure it's clean
    bus_id = record['bus_id'].strip() if record['bus_id'] else None
    if not bus_id:
        issues.append("Missing bus_id")
    
    # Fix route - remove extra whitespace
    route = ' '.join(record['route'].strip().split()) if record['route'] else None
    if not route:
        issues.append("Missing route")
    
    # Fix bus_type - standardize
    bus_type = record['bus_type'].strip() if record['bus_type'] else 'Ordinary'
    
    # Fix depot
    depot = record['depot'].strip() if record['depot'] else 'Unknown'
    
    # Fix date
    date = parse_date(record['date'])
    if date is None:
        issues.append(f"Invalid date: {record['date']}")
        # Use a default date if parsing fails
        date = '2024-01-01'
    
    # Fix capacity - must be positive integer
    try:
        capacity = int(record['capacity'])
        if capacity <= 0:
            issues.append("Invalid capacity")
            capacity = 1
    except ValueError:
        issues.append(f"Invalid capacity: {record['capacity']}")
        capacity = 1
    
    # Fix passengers - must be non-negative integer
    try:
        passengers = int(record['passengers'])
        if passengers < 0:
            passengers = 0
    except ValueError:
        issues.append(f"Invalid passengers: {record['passengers']}")
        passengers = 0
    
    # Fix occupancy_rate - must be between 0 and 100
    try:
        occupancy_rate = float(record['occupancy_rate'])
        if occupancy_rate < 0:
            occupancy_rate = 0
        elif occupancy_rate > 100:
            occupancy_rate = 100
    except ValueError:
        issues.append(f"Invalid occupancy_rate: {record['occupancy_rate']}")
        occupancy_rate = 0
    
    # Fix distance_km - must be positive
    try:
        distance_km = float(record['distance_km'])
        if distance_km < 0:
            distance_km = 0
    except ValueError:
        issues.append(f"Invalid distance_km: {record['distance_km']}")
        distance_km = 0
    
    # Fix fare_per_passenger - must be non-negative
    try:
        fare_per_passenger = float(record['fare_per_passenger'])
        if fare_per_passenger < 0:
            fare_per_passenger = 0
    except ValueError:
        issues.append(f"Invalid fare_per_passenger: {record['fare_per_passenger']}")
        fare_per_passenger = 0
    
    # Fix revenue - must be non-negative
    try:
        revenue = float(record['revenue'])
        if revenue < 0:
            revenue = 0
    except ValueError:
        issues.append(f"Invalid revenue: {record['revenue']}")
        revenue = 0
    
    # Fix fuel_consumed_liters - must be non-negative
    try:
        fuel_consumed_liters = float(record['fuel_consumed_liters'])
        if fuel_consumed_liters < 0:
            fuel_consumed_liters = 0
    except ValueError:
        issues.append(f"Invalid fuel_consumed_liters: {record['fuel_consumed_liters']}")
        fuel_consumed_liters = 0
    
    # Fix month
    month = record['month'].strip() if record['month'] else 'Unknown'
    
    # Fix day_of_week
    day_of_week = record['day_of_week'].strip() if record['day_of_week'] else 'Unknown'
    
    return {
        'bus_id': bus_id,
        'route': route,
        'bus_type': bus_type,
        'depot': depot,
        'date': date,
        'capacity': capacity,
        'passengers': passengers,
        'occupancy_rate': occupancy_rate,
        'distance_km': distance_km,
        'fare_per_passenger': fare_per_passenger,
        'revenue': revenue,
        'fuel_consumed_liters': fuel_consumed_liters,
        'month': month,
        'day_of_week': day_of_week
    }, issues

def import_csv_to_sqlite():
    """Import CSV data into SQLite database using bulk insert for speed"""
    
    print(f"Reading CSV file: {CSV_FILE}")
    
    # Read and parse CSV
    records = []
    issues_count = 0
    fixed_records = []
    
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)
    
    print(f"Total records in CSV: {len(records)}")
    
    # Validate and fix each record
    print("Validating and fixing records...")
    for record in records:
        fixed_record, issues = validate_and_fix_record(record)
        if issues:
            issues_count += len(issues)
            # Only print first few issues to avoid clutter
            if issues_count <= 5:
                print(f"  Issues in {fixed_record.get('bus_id', 'Unknown')}: {issues}")
        fixed_records.append(fixed_record)
    
    print(f"Total issues found and fixed: {issues_count}")
    
    # Connect to SQLite database
    print(f"Connecting to database: {DB_FILE}")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Check if table exists
    cursor.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='bookings_bus'
    """)
    table_exists = cursor.fetchone()
    
    if not table_exists:
        print("Creating bookings_bus table...")
        # Create table based on Django model
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bookings_bus (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bus_id VARCHAR(50) UNIQUE NOT NULL,
                route VARCHAR(100) NOT NULL,
                bus_type VARCHAR(50) DEFAULT 'Standard',
                depot VARCHAR(100),
                date DATE NOT NULL,
                capacity INTEGER NOT NULL,
                passengers INTEGER NOT NULL DEFAULT 0,
                occupancy_rate REAL DEFAULT 0,
                distance_km REAL DEFAULT 0,
                fare_per_passenger REAL DEFAULT 0,
                revenue REAL DEFAULT 0,
                fuel_consumed_liters REAL DEFAULT 0,
                month VARCHAR(20),
                day_of_week VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create index for faster lookups
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_bus_id 
            ON bookings_bus(bus_id)
        """)
    else:
        print("Table bookings_bus already exists")
        # Check existing records
        cursor.execute("SELECT COUNT(*) FROM bookings_bus")
        existing_count = cursor.fetchone()[0]
        print(f"Existing records in database: {existing_count}")
        
        # Clear existing transport data (keep other bus records if any)
        # But since the bus_id is unique, we can use INSERT OR REPLACE
        print("Clearing existing APSRTC transport data...")
        cursor.execute("DELETE FROM bookings_bus WHERE bus_id LIKE 'AP%'")
        deleted_count = cursor.rowcount
        print(f"Deleted {deleted_count} existing APSRTC records")
    
    # Bulk insert using executemany for speed
    print("Importing data using bulk insert (fast mode)...")
    
    # Use INSERT OR REPLACE to handle duplicates
    insert_sql = """
        INSERT OR REPLACE INTO bookings_bus (
            bus_id, route, bus_type, depot, date, capacity, passengers,
            occupancy_rate, distance_km, fare_per_passenger, revenue,
            fuel_consumed_liters, month, day_of_week
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    # Prepare data tuples
    data_tuples = [
        (
            r['bus_id'], r['route'], r['bus_type'], r['depot'], r['date'],
            r['capacity'], r['passengers'], r['occupancy_rate'],
            r['distance_km'], r['fare_per_passenger'], r['revenue'],
            r['fuel_consumed_liters'], r['month'], r['day_of_week']
        )
        for r in fixed_records
    ]
    
    # Use transaction for speed
    cursor.executemany(insert_sql, data_tuples)
    
    # Commit the transaction
    conn.commit()
    
    # Verify import
    cursor.execute("SELECT COUNT(*) FROM bookings_bus WHERE bus_id LIKE 'AP%'")
    final_count = cursor.fetchone()[0]
    
    print(f"Successfully imported {final_count} records!")
    
    # Show sample data
    print("\nSample imported data:")
    cursor.execute("""
        SELECT bus_id, route, bus_type, depot, date, capacity, 
               passengers, occupancy_rate, revenue
        FROM bookings_bus 
        WHERE bus_id LIKE 'AP%' 
        LIMIT 5
    """)
    
    for row in cursor.fetchall():
        print(f"  {row}")
    
    # Close connection
    conn.close()
    
    print("\nImport completed successfully!")
    return final_count

if __name__ == '__main__':
    import_csv_to_sqlite()
