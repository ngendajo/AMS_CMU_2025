from datetime import datetime

from django.db import models
from api.models import User

# Staff model
class CrcProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='profile')
    position = models.CharField(max_length=2000)

    def __str__(self):
        return str(self.user)


# Grade model

class Grade(models.Model):
    grade_name = models.CharField(max_length=500)
    start_academic_year = models.CharField(max_length=500)
    end_academic_year = models.CharField(max_length=500)

    def __str__(self):
        return str(self.grade_name)

# Families model
class Family(models.Model):
    grade = models.ForeignKey(Grade, related_name="families", on_delete=models.PROTECT)
    family_name = models.CharField(max_length=100)
    family_number = models.IntegerField(null=True, blank=True)
    family_mother = models.CharField(max_length=200, blank=True, default="")
    family_mother_tel = models.CharField(max_length=200, blank=True, default="")

    def __str__(self):
        return str(self.family_name)


# Combination models
class Combination(models.Model):
    combination_name = models.CharField(max_length=500)

    def __str__(self):
        return str(self.combination_name)

# Eps model
class Ep(models.Model):
    title = models.CharField(max_length=500)
    TYPES = (
        ('A', 'Art'),
        ('S', 'Sport'),
        ('SC', 'Sciences'),
        ('C', 'Club'),
        ('P', 'Professional'),
    )
    type = models.CharField(max_length=2, choices=TYPES)

    def __str__(self):
        return str(self.title)

# Alumn model

class Alumni(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='alumn')
    date_of_birth = models.CharField(max_length=200,default="")
    gender = models.CharField(max_length=500)
    father = models.CharField(max_length=500,default="")
    mother = models.CharField(max_length=500,default="")
    place_of_birth = models.CharField(max_length=500,default="")
    did_you_born_in_rwanda = models.BooleanField(default=True)
    place_of_birth_district_or_country = models.CharField(max_length=500,default="")
    place_of_birth_sector_or_city = models.CharField(max_length=500,default="")
    life = (
        ('A', 'Alive'),
        ('D', 'Died'),
    ) 
    life_status = models.CharField(max_length=2,choices=life,default="A")
    marital_status = models.CharField(max_length=500) 
    currresidence = models.CharField(max_length=500,default="")
    currresidence_in_rwanda = models.BooleanField(default=True)
    currresidence_district_or_country = models.CharField(max_length=500,default="")
    currresidence_sector_or_city = models.CharField(max_length=500,default="")
    kids = models.BooleanField(default=False)
    family = models.ForeignKey(Family,on_delete=models.PROTECT, related_name="alumnis")
    combination = models.ForeignKey(Combination,related_name="alumnis",on_delete=models.PROTECT)
    eps = models.ManyToManyField(Ep, related_name="alumnis",blank=True)
    s4marks =models.FloatField(default=0.0)
    s5marks =models.FloatField(default=0.0)
    s6marks =models.FloatField(default=0.0)
    ne =models.FloatField(default=0.0)
    maxforne =models.FloatField(default=0.0)
    dec = (
        ('P', 'Pass'),
        ('F', 'Fail'),
    ) 
    decision = models.CharField(max_length=2,choices=dec,default="P")
    


# Employment model
class Employment(models.Model):
    title = models.CharField(max_length=5000)
    alumn = models.ForeignKey(Alumni, on_delete=models.PROTECT, related_name='employement')
    emps = (
        ('F', 'Full-time'),
        ('P', 'Part-time'),
        ('S', 'Self-employed'),
        ('I', 'Intern'),
        ('U', 'Unemployed'),
        ('D', 'Deceased'),
        ('N', 'NoInfo'),
    ) 
    status = models.CharField(max_length=2, choices=emps)
    career = models.CharField(max_length=2000, default="")
    description = models.CharField(max_length=2000)
    company = models.CharField(max_length=5000)
    start_date = models.CharField(max_length=100, default="")
    end_date = models.CharField(max_length=100, default="old")

    def __str__(self):
        return str(self.title)


# Opportunity model
class Opportunity(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='opportunities')
    title = models.CharField(max_length=5000)
    description = models.CharField(max_length=200)
    approved = models.BooleanField(default=False)
    post_time = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return str(self.title)


# Event model
class Event(models.Model):
    title = models.CharField(max_length=5000)
    description = models.CharField(max_length=20000)
    startDate = models.DateTimeField(auto_now=True)
    endDate = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="events")
    image_url = models.ImageField(upload_to='events', default='events/default.jpg')

    def __str__(self):
        return str(self.title)


# Studie model
class Studie(models.Model):
    alumn = models.ForeignKey(Alumni, on_delete=models.PROTECT, related_name='studies')
    levels = (
        ('C', 'Certificate'),
        ('A1', 'Advanced diploma'),
        ('A0', 'Bachelors'),
        ('M', 'Masters'),
        ('PHD', 'PHD'),
        ('NMS', 'No More Study'),
        ('D', 'Deceased'),
        ('N', 'NoInfo'),
    )
    level = models.CharField(max_length=3, choices=levels, default='NMS')
    degree = models.CharField(max_length=2500)
    university = models.CharField(max_length=2500)
    country = models.CharField(max_length=200)
    Scholarships = (
        ('F', 'Full'),
        ('P', 'Partial'),
        ('NS', 'No Scholarship'),
        ('D', 'Deceased'),
        ('N', 'NoInfo'),
        ('NMS', 'No More Study'),
    )
    scholarship = models.CharField(max_length=3, choices=Scholarships)
    scholarship_details = models.CharField(max_length=2000,default="")
    Statuss = (
        ('D', 'Dropped_Out'),
        ('S', 'Susepended'),
        ('O', 'On_going'),
        ('C', 'Completed'),
        ('De', 'Deceased'),
        ('N', 'NoInfo'),
        ('NMS', 'NoFurtherStudy'),
    )
    status = models.CharField(max_length=3, choices=Statuss)

    def __str__(self):
        return str(self.alumn.user.first_name + self.university)


# Story model
class Story(models.Model):
    alumn = models.ForeignKey(Alumni, on_delete=models.PROTECT, related_name='stories')
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
    title = models.CharField(max_length=5000)
    description = models.CharField(max_length=5000)
    date = models.DateTimeField(auto_now=True)
    image_url = models.ImageField(upload_to='news', default='news/default.jpg')
    pinned = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
#Library Management System

#Students
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    family = models.ForeignKey(Family,on_delete=models.PROTECT, related_name="rfamily")
    combination = models.ForeignKey(Combination,related_name="rcombination",on_delete=models.PROTECT)
    studentid = models.CharField(max_length=30)

    def __str__(self):
        return str(self.user.first_name + "student")
    
# Authors models
class Author(models.Model):
    author_name = models.CharField(max_length=500)
    author_id = models.IntegerField(unique=True,null=True)

    def __str__(self):
        return str(self.author_name)
    
# Category models
class Category(models.Model):
    category_name = models.CharField(max_length=500)
    category_id = models.IntegerField(unique=True,null=True)

    def __str__(self):
        return str(self.category_name)
    
# Books models
class Book(models.Model):
    book_name = models.CharField(max_length=500)
    isbnumber = models.CharField(max_length=100)
    number_of_books = models.CharField(max_length=30)
    category = models.ForeignKey(Category,on_delete=models.PROTECT, related_name="categ")
    author = models.ForeignKey(Author,related_name="autho",on_delete=models.PROTECT)

    def __str__(self):
        return str(self.book_name)
    
# Issue Books models
class Issue_Book(models.Model):
    book = models.ForeignKey(Book,on_delete=models.PROTECT, related_name="boo")
    borrower = models.ForeignKey(User,on_delete=models.PROTECT, related_name="borrow")
    library_number = models.CharField(max_length=30)
    issuedate = models.CharField(max_length=70)
    returndate = models.CharField(max_length=70)
    

    def __str__(self):
        return str(self.book.book_name + self.borrower.first_name + "borrow")
    
#Attendance System
class Atendance(models.Model):
    user = models.ForeignKey(User,on_delete=models.PROTECT, related_name="atend")
    atendance_date = models.CharField(max_length=70)
    period = models.CharField(max_length=30)
    

    def __str__(self):
        return str(self.user.first_name + "student")
    
class Term(models.Model):
    term_name = models.CharField(max_length=70)
    startdate = models.CharField(max_length=70)
    enddate = models.CharField(max_length=70)
    

    def __str__(self):
        return str(self.term_name)

