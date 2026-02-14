from django.db import models
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
import csv
import os
from datetime import datetime


class Bus(models.Model):
    id = models.BigAutoField(primary_key=True)  # REQUIRED for Django admin

    bus_id = models.CharField(max_length=50, unique=True)
    route = models.CharField(max_length=100)
    bus_type = models.CharField(max_length=50)
    depot = models.CharField(max_length=100)
    date = models.DateField()

    capacity = models.PositiveIntegerField()
    passengers = models.PositiveIntegerField()

    occupancy_rate = models.FloatField()
    distance_km = models.FloatField()

    fare_per_passenger = models.DecimalField(max_digits=8, decimal_places=2)
    revenue = models.DecimalField(max_digits=10, decimal_places=2)

    fuel_consumed_liters = models.FloatField()
    month = models.CharField(max_length=20)
    day_of_week = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.bus_id} - {self.route}"

    @classmethod
    def parse_date(cls, date_str):
        """Parse date from DD-MM-YYYY format to YYYY-MM-DD"""
        try:
            dt = datetime.strptime(date_str.strip(), '%d-%m-%Y')
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            return '2024-01-01'

    @classmethod
    def validate_and_fix_record(cls, record):
        """Validate and fix a single CSV record"""
        issues = []
        
        bus_id = record['bus_id'].strip() if record['bus_id'] else None
        if not bus_id:
            issues.append("Missing bus_id")
        
        route = ' '.join(record['route'].strip().split()) if record['route'] else None
        if not route:
            issues.append("Missing route")
        
        bus_type = record['bus_type'].strip() if record['bus_type'] else 'Ordinary'
        depot = record['depot'].strip() if record['depot'] else 'Unknown'
        date = cls.parse_date(record['date'])
        if date is None:
            issues.append(f"Invalid date: {record['date']}")
            date = '2024-01-01'
        
        try:
            capacity = int(record['capacity'])
            if capacity <= 0:
                issues.append("Invalid capacity")
                capacity = 1
        except ValueError:
            issues.append(f"Invalid capacity: {record['capacity']}")
            capacity = 1
        
        try:
            passengers = int(record['passengers'])
            if passengers < 0:
                passengers = 0
        except ValueError:
            issues.append(f"Invalid passengers: {record['passengers']}")
            passengers = 0
        
        try:
            occupancy_rate = float(record['occupancy_rate'])
            if occupancy_rate < 0:
                occupancy_rate = 0
            elif occupancy_rate > 100:
                occupancy_rate = 100
        except ValueError:
            issues.append(f"Invalid occupancy_rate: {record['occupancy_rate']}")
            occupancy_rate = 0
        
        try:
            distance_km = float(record['distance_km'])
            if distance_km < 0:
                distance_km = 0
        except ValueError:
            issues.append(f"Invalid distance_km: {record['distance_km']}")
            distance_km = 0
        
        try:
            fare_per_passenger = float(record['fare_per_passenger'])
            if fare_per_passenger < 0:
                fare_per_passenger = 0
        except ValueError:
            issues.append(f"Invalid fare_per_passenger: {record['fare_per_passenger']}")
            fare_per_passenger = 0
        
        try:
            revenue = float(record['revenue'])
            if revenue < 0:
                revenue = 0
        except ValueError:
            issues.append(f"Invalid revenue: {record['revenue']}")
            revenue = 0
        
        try:
            fuel_consumed_liters = float(record['fuel_consumed_liters'])
            if fuel_consumed_liters < 0:
                fuel_consumed_liters = 0
        except ValueError:
            issues.append(f"Invalid fuel_consumed_liters: {record['fuel_consumed_liters']}")
            fuel_consumed_liters = 0
        
        month = record['month'].strip() if record['month'] else 'Unknown'
        day_of_week = record['day_of_week'].strip() if record['day_of_week'] else 'Unknown'
        
        return {
            'bus_id': bus_id, 'route': route, 'bus_type': bus_type, 'depot': depot,
            'date': date, 'capacity': capacity, 'passengers': passengers,
            'occupancy_rate': occupancy_rate, 'distance_km': distance_km,
            'fare_per_passenger': fare_per_passenger, 'revenue': revenue,
            'fuel_consumed_liters': fuel_consumed_liters, 'month': month, 'day_of_week': day_of_week
        }, issues

    @classmethod
    def import_from_csv(cls, csv_file_path=None):
        """Fast bulk import using Django ORM with transactions"""
        if csv_file_path is None:
            # CSV file is in Django/travels/, go up two directories from bookings/
            csv_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'APSRTC_Transport_Db.csv')
        
        print(f"Reading CSV file: {csv_file_path}")
        
        records = []
        issues_count = 0
        
        with open(csv_file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                records.append(row)
        
        print(f"Total records in CSV: {len(records)}")
        
        print("Validating and fixing records...")
        fixed_records = []
        for record in records:
            fixed_record, issues = cls.validate_and_fix_record(record)
            if issues:
                issues_count += len(issues)
            fixed_records.append(fixed_record)
        
        print(f"Total issues found and fixed: {issues_count}")
        
        deleted_count = cls.objects.filter(bus_id__startswith='AP').delete()[0]
        print(f"Deleted {deleted_count} existing APSRTC records")
        
        print("Importing data using bulk create (fast mode)...")
        bus_objects = []
        
        for r in fixed_records:
            bus_objects.append(cls(
                bus_id=r['bus_id'], route=r['route'], bus_type=r['bus_type'],
                depot=r['depot'], date=r['date'], capacity=r['capacity'],
                passengers=r['passengers'], occupancy_rate=r['occupancy_rate'],
                distance_km=r['distance_km'], fare_per_passenger=r['fare_per_passenger'],
                revenue=r['revenue'], fuel_consumed_liters=r['fuel_consumed_liters'],
                month=r['month'], day_of_week=r['day_of_week']
            ))
        
        with transaction.atomic():
            cls.objects.bulk_create(bus_objects, ignore_conflicts=True)
        
        # Now fetch the imported buses and create seats for each
        print("Creating seats for each bus...")
        imported_buses = cls.objects.filter(bus_id__startswith='AP').values_list('id', 'capacity')
        
        # Delete existing seats for APSRTC buses
        from .models import Seat
        Seat.objects.filter(bus__bus_id__startswith='AP').delete()
        
        # Create seats for each bus
        seat_objects = []
        for bus_id, capacity in imported_buses:
            bus_obj = cls.objects.get(id=bus_id)
            for i in range(1, capacity + 1):
                seat_objects.append(Seat(bus=bus_obj, seat_number=f"S{i}"))
        
        # Bulk create all seats
        with transaction.atomic():
            Seat.objects.bulk_create(seat_objects)
        
        seat_count = len(seat_objects)
        
        final_count = cls.objects.filter(bus_id__startswith='AP').count()
        print(f"Successfully imported {final_count} bus records with {seat_count} seats!")
        
        print("\nSample imported data:")
        sample_buses = cls.objects.filter(bus_id__startswith='AP')[:5]
        for bus in sample_buses:
            seat_count = bus.seats.count()
            print(f"  {bus.bus_id} - {bus.route} - {bus.bus_type} - {seat_count} seats")
        
        print("\nImport completed successfully!")
        return final_count


class Seat(models.Model):
    bus = models.ForeignKey(
        Bus,
        on_delete=models.CASCADE,
        related_name='seats'
    )
    seat_number = models.CharField(max_length=10)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.bus.bus_id} - Seat {self.seat_number}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    booking_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.bus.bus_id} - {self.seat.seat_number}"

    @property
    def fare_per_passenger(self):
        return self.bus.fare_per_passenger

    @property
    def route(self):
        return self.bus.route




