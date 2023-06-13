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
    

#Employment model
class Employment(models.Model):
    title = models.CharField(max_length=50)
    emps = (
		('W', 'working'),
		('P', 'past'),
    )
    status = models.CharField(max_length=2, choices=emps)
    description = models.CharField(max_length=200)
    company = models.CharField(max_length=50)
    
    def __str__(self):
        return str(self.title)
    
#Alumn model

class Alumni(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='alumn')
    marital_status= models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    Family = models.ForeignKey(Family,on_delete=models.CASCADE, related_name="alumnis")
    Combination = models.ForeignKey(Combination,related_name="alumnis",on_delete=models.CASCADE)
    Eps = models.ManyToManyField(Ep, related_name="alumnis")
    employments= models.ManyToManyField(Employment, related_name="employments")
    kids = models.BooleanField
    father = models.CharField(max_length=50)
    mother = models.CharField(max_length=50)
    place_of_birth = models.CharField(max_length=50)
    CurrResidence = models.CharField(max_length=50)


#Opportunity model
class Opportunity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='opportunities')
    title =  models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    approved = models.BooleanField
    postTime = models.DateTimeField

#Event model
class Event(models.Model):
    title= models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    date = models.DateField()

    def __str__(self):
        return str(self.title)
    

class Studie(models.Model):
    alumn = models.OneToOneField(Alumni, on_delete=models.CASCADE, related_name='studie')
    degree = models.CharField(max_length=50)
    university = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    Scholarships = (
		('F', 'Full'),
		('P', 'Partial'),
        ('N', 'None'),
	)
    scholarship = models.CharField(max_length=2, choices=Scholarships)
    Statuss = (
		('D', 'Dropped_Out'),
		('S', 'Susepended'),
        ('C', 'Completed'),
	)
    status = models.CharField(max_length=2, choices=Statuss)

