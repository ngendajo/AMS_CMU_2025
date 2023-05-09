from django.db import models
from api.models import User


class CrcProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    position=models.CharField(max_length=200)

    def __str__(self):
        return str(self.user)