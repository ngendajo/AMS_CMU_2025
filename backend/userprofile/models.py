from django.db import models
from api.models import User

#Staff model
class CrcProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    position=models.CharField(max_length=200)

    def __str__(self):
        return str(self.user)
    
#Grade model
    
class Grade(models.Model):
    grade_name = models.CharField(max_length=50)
    start_academic_year = models.CharField(max_length=50)
    end_academic_year = models.CharField(max_length=50)
    
    def __str__(self):
        return str(self.grade_name)
    
#Families model
class Family(models.Model):
    grade =models.ForeignKey(Grade,related_name="families", on_delete=models.CASCADE)
    family_name = models.CharField(max_length=100)
    family_number = models.IntegerField(null=True,blank=True)
    family_mother = models.CharField(max_length=200,blank=True,default="")
    family_mother_tel = models.CharField(max_length=200,blank=True,default="")
    
    def __str__(self):
        return str(self.family_name)
    
#Combination models
class Combination(models.Model):
    combination_name = models.CharField(max_length=50)
    
    def __str__(self):
        return str(self.combination_name)

#Eps model
class Ep(models.Model):
    title = models.CharField(max_length=50)
    TYPES = (
		('A', 'Art'),
		('S', 'Sport'),
        ('SC', 'Sciences'),
        ('C', 'Club'),
	)
    type = models.CharField(max_length=2, choices=TYPES)
    
    def __str__(self):
        return str(self.title)