from datetime import datetime

from django.db import models
from api.models import User

# Staff model
class CrcProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    position = models.CharField(max_length=200)

    def __str__(self):
        return str(self.user)


# Grade model

class Grade(models.Model):
    grade_name = models.CharField(max_length=50)
    start_academic_year = models.CharField(max_length=50)
    end_academic_year = models.CharField(max_length=50)

    def __str__(self):
        return str(self.grade_name)

# Families model
class Family(models.Model):
    grade = models.ForeignKey(Grade, related_name="families", on_delete=models.CASCADE)
    family_name = models.CharField(max_length=100)
    family_number = models.IntegerField(null=True, blank=True)
    family_mother = models.CharField(max_length=200, blank=True, default="")
    family_mother_tel = models.CharField(max_length=200, blank=True, default="")

    def __str__(self):
        return str(self.family_name)


# Combination models
class Combination(models.Model):
    combination_name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.combination_name)

# Eps model
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

# Alumn model

class Alumni(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='alumn')
    marital_status = models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    family = models.ForeignKey(Family,on_delete=models.CASCADE, related_name="alumnis")
    combination = models.ForeignKey(Combination,related_name="alumnis",on_delete=models.CASCADE)
    eps = models.ManyToManyField(Ep, related_name="alumnis",blank=True)
    kids = models.BooleanField(default=False)
    father = models.CharField(max_length=50,default="")
    mother = models.CharField(max_length=50,default="")
    place_of_birth = models.CharField(max_length=50,default="")
    currresidence = models.CharField(max_length=50,default="")
    s4marks =models.FloatField(default=0.0)
    s5marks =models.FloatField(default=0.0)
    s6marks =models.FloatField(default=0.0)
    ne =models.FloatField(default=0.0)
    maxforne =models.FloatField(default=0.0)


# Employment model
class Employment(models.Model):
    title = models.CharField(max_length=50)
    alumn = models.ForeignKey(Alumni, on_delete=models.CASCADE, related_name='employement')
    emps = (
        ('F', 'Full-time'),
        ('P', 'Part-time'),
        ('S', 'Self-employed'),
        ('I', 'Intern'),
    )
    status = models.CharField(max_length=2, choices=emps)
    career = models.CharField(max_length=200, default="")
    description = models.CharField(max_length=200)
    company = models.CharField(max_length=50)
    start_date = models.CharField(max_length=50, default="")
    end_date = models.CharField(max_length=50, default="Up to now")

    def __str__(self):
        return str(self.title)


# Opportunity model
class Opportunity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='opportunities')
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    approved = models.BooleanField(default=False)
    post_time = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return str(self.title)


# Event model
class Event(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    startDate = models.DateTimeField(auto_now=True)
    endDate = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    image_url = models.ImageField(upload_to='events', default='events/default.jpg')

    def __str__(self):
        return str(self.title)


# Studie model
class Studie(models.Model):
    alumn = models.ForeignKey(Alumni, on_delete=models.CASCADE, related_name='studies')
    levels = (
        ('A2', 'Advanced level degree'),
        ('A1', 'Advanced diploma'),
        ('A0', 'Bachelors'),
        ('M', 'Masters'),
        ('PHD', 'PHD'),
    )
    level = models.CharField(max_length=3, choices=levels, default='A2')
    degree = models.CharField(max_length=50)
    university = models.CharField(max_length=50)
    country = models.CharField(max_length=200)
    Scholarships = (
        ('F', 'Full'),
        ('P', 'Partial'),
        ('N', 'None'),
    )
    scholarship = models.CharField(max_length=2, choices=Scholarships)
    scholarship_details = models.CharField(max_length=200,default="")
    Statuss = (
        ('D', 'Dropped_Out'),
        ('S', 'Susepended'),
        ('O', 'On_going'),
        ('C', 'Completed'),
    )
    status = models.CharField(max_length=2, choices=Statuss)

    def __str__(self):
        return str(self.alumn.user.first_name + self.university)


# Story model
class Story(models.Model):
    alumn = models.ForeignKey(Alumni, on_delete=models.CASCADE, related_name='stories')
    description = models.CharField(max_length=5000)
    displayed = models.BooleanField(default=False)

    def __str__(self):
        return str(self.alumn.user.first_name + "story")


# Gallery model
class Gallery(models.Model):
    image_url = models.ImageField(upload_to='galleries', default='galleries/default.jpg')
    displayed = models.BooleanField(default=True)


# News model
class News(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now=True)
    image_url = models.ImageField(upload_to='news', default='news/default.jpg')
    pinned = models.BooleanField(default=False)

    def __str__(self):
        return self.title

