
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Bus, Seat

@receiver(post_save, sender=Bus)
def create_seats_for_bus(sender, instance, created, **kwargs):
    if created:
        # Use bulk_create for fast seat creation
        seats = [Seat(bus=instance, seat_number=f"S{i}") for i in range(1, instance.capacity + 1)]
        Seat.objects.bulk_create(seats)
