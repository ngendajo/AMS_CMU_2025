from datetime import datetime
from django.utils import timezone
from django.db import models
from api.models import User
from datetime import date
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.db.models.signals import pre_save
from django.dispatch import receiver

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
    other_emails = models.CharField(max_length=500,default="")
    other_phones = models.CharField(max_length=500,default="")
    date_of_birth = models.CharField(max_length=200,default="")
    gender = models.CharField(max_length=500)
    reg_number = models.CharField(max_length=50, blank=True, unique=True)
    father = models.CharField(max_length=500,default="")
    mother = models.CharField(max_length=500,default="")
    place_of_birth = models.CharField(max_length=500,default="")
    did_you_born_in_rwanda = models.CharField(max_length=500,default="")
    place_of_birth_district_or_country = models.CharField(max_length=500,default="")
    place_of_birth_sector_or_city = models.CharField(max_length=500,default="")
    life = (
        ('A', 'Alive'),
        ('D', 'Died'),
    ) 
    life_status = models.CharField(max_length=2,choices=life,default="A")
    marital_status = models.CharField(max_length=500) 
    currresidence = models.CharField(max_length=500,default="")
    currresidence_in_rwanda = models.CharField(max_length=500,default="")
    currresidence_district_or_country = models.CharField(max_length=500,default="")
    currresidence_sector_or_city = models.CharField(max_length=500,default="")
    kids = models.CharField(max_length=500,default="")
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
    ) 
    status = models.CharField(max_length=2, choices=emps)
    career = models.CharField(max_length=2000, default="")
    description = models.CharField(max_length=2000 , default="")
    company = models.CharField(max_length=5000)
    on_going = models.BooleanField(default=False)
    start_date = models.CharField(max_length=100, default="")
    end_date = models.CharField(max_length=100, default="")

    def __str__(self):
        return str(self.title)


# Opportunity model
class Opportunity(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='opportunities')
    title = models.CharField(max_length=5000)
    op_type = models.CharField(max_length=100, default="Full Time")
    description = models.CharField(max_length=200)
    diedline = models.CharField(max_length=1000, default="2024-08-23")
    link = models.CharField(max_length=100, default="asyv.ac.rw")
    approved = models.BooleanField(default=False)
    post_time = models.CharField(
        max_length=100, 
        default=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    def __str__(self):
        return str(self.title)


# Event model
class Event(models.Model):
    title = models.CharField(max_length=5000)
    description = models.CharField(max_length=20000)
    e_datetime = models.DateTimeField(default=timezone.now)
    location = models.CharField(max_length=5000 , default='NMS')
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
    )
    level = models.CharField(max_length=3, choices=levels, default='NMS')
    degree = models.CharField(max_length=2500)
    university = models.CharField(max_length=2500)
    country = models.CharField(max_length=200)
    city = models.CharField(max_length=200,default="")
    Scholarships = (
        ('F', 'Full'),
        ('P', 'Partial'),
        ('S', 'Self-Sponsor'),
    )
    scholarship = models.CharField(max_length=3, choices=Scholarships)
    scholarship_details = models.CharField(max_length=2000,default="")
    Statuss = (
        ('D', 'Dropped_Out'),
        ('S', 'Susepended'),
        ('O', 'On_going'),
        ('C', 'Completed'),
    )
    status = models.CharField(max_length=3, choices=Statuss)

    def __str__(self):
        return str(self.alumn.user.first_name + self.university)

class Employmentdraft(models.Model):
    title = models.CharField(max_length=5000)
    alumn = models.ForeignKey(Alumni, on_delete=models.PROTECT, related_name='employ')
    
    EMPLOYMENT_CHOICES = (
        ('F', 'Full-time'),
        ('P', 'Part-time'),
        ('S', 'Self-employed'),
        ('I', 'Intern'),
    ) 
    status = models.CharField(max_length=2, choices=EMPLOYMENT_CHOICES)
    career = models.CharField(max_length=2000, default="")
    description = models.CharField(max_length=2000, default="")
    company = models.CharField(max_length=5000)
    on_going = models.BooleanField(default=False)
    start_date = models.CharField(max_length=100, default="")
    end_date = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.title

class Studiedraft(models.Model):
    alumn = models.ForeignKey('Alumni', on_delete=models.PROTECT, related_name='studiedrafts')
    
    LEVEL_CHOICES = (
        ('C', 'Certificate'),
        ('A1', 'Advanced diploma'),
        ('A0', 'Bachelors'),
        ('M', 'Masters'),
        ('PHD', 'PHD'),
    )
    level = models.CharField(max_length=3, choices=LEVEL_CHOICES, default='NMS')
    degree = models.CharField(max_length=2500)
    university = models.CharField(max_length=2500)
    country = models.CharField(max_length=200)
    city = models.CharField(max_length=200, default="")
    
    SCHOLARSHIP_CHOICES = (
        ('F', 'Full'),
        ('P', 'Partial'),
        ('S', 'Self-Sponsor'),
    )
    scholarship = models.CharField(max_length=3, choices=SCHOLARSHIP_CHOICES)
    scholarship_details = models.CharField(max_length=2000, default="")
    
    STATUS_CHOICES = (
        ('D', 'Dropped_Out'),
        ('S', 'Suspended'),
        ('O', 'On_going'),
        ('C', 'Completed'),
    )
    status = models.CharField(max_length=3, choices=STATUS_CHOICES)

    def __str__(self):
        return str(self.alumn.user.first_name + ' - ' + self.university)


# Story model
class Story(models.Model):
    alumn = models.ForeignKey(Alumni, on_delete=models.PROTECT, related_name='stories')
    title = models.CharField(max_length=500, blank=True, null=True)
    description = models.CharField(max_length=5000)
    image = models.ImageField(upload_to='storyimages/', blank=True, null=True)
    video = models.FileField(upload_to='storyvideos/', blank=True, null=True)
    draft = models.BooleanField(default=True)
    displayed = models.BooleanField(default=False)
    createdat = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return str(self.alumn.user.first_name + "story")
    
#alumni businesses
class AlumniBusiness(models.Model):
    alumn = models.ManyToManyField(Alumni, related_name='businesses')
    title = models.CharField(max_length=500, blank=True, null=True)
    description = models.CharField(max_length=5000)
    image = models.ImageField(upload_to='businessimages/', blank=True, null=True)
    video = models.URLField(blank=True, null=True)  # Change FileField to URLField
    displayed = models.BooleanField(default=False)
    createdat = models.DateTimeField(default=datetime.now)


# Gallery model
class Gallery(models.Model):
    event_name = models.CharField(max_length=1000, default="Event name")
    link = models.CharField(max_length=1000, default="asyv.ac.rw")
    createdat = models.DateField(default=date.today)
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
    
class PDFNews(models.Model):
    title = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to='pdf_news/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
#new models (Announcement, Inquiries, frequentlyaskedquestions, Groups )
class Announcement(models.Model):
    text = models.TextField()
    date_time = models.DateTimeField(default=datetime.now)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    pinned = models.BooleanField(default=False)

class Inquiry(models.Model):
    sent_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_inquiries')
    inquiry = models.TextField()
    email = models.EmailField()
    time_date = models.DateTimeField()
    answered_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answered_inquiries', null=True, blank=True)
    answer = models.TextField(null=True, blank=True)

class FrequentlyAskedQuestion(models.Model):
    question = models.TextField()
    answer = models.TextField()
    pinned = models.BooleanField(default=False)

class Group(models.Model):
    group_name = models.CharField(max_length=100)
    whatsapp_link = models.URLField()
    qr_code = models.ImageField(upload_to='qr_codes/')
    pinned = models.BooleanField(default=False)
#Donation Track
class SampleMoMoCode(models.Model):
    code = models.CharField(max_length=6)

    def __str__(self):
        return self.code

class SampleDonation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    sampleMoMoCode = models.ForeignKey(SampleMoMoCode, on_delete=models.CASCADE)
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user} - {self.amount}'
#Mentoship
class MentorshipCard(models.Model):
    MENTORSHIP_OPTIONS = [
        ('Mentors', 'Mentors'),
        ('Volunteers', 'Volunteers'),
        ('Workshops', 'Workshops'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    date = models.DateField()
    op_type = models.CharField(max_length=10, choices=MENTORSHIP_OPTIONS)

    def __str__(self):
        return self.title

class SampleApplicationsData(models.Model):
    mentorship = models.ForeignKey(MentorshipCard, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"Application {self.id} for {self.mentorship.title} by {self.user.email}"
    
#Library Management System

#Students
class Student(models.Model):  
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    family = models.ForeignKey(Family, on_delete=models.PROTECT, related_name="rfamily")
    combination = models.ForeignKey(Combination, related_name="rcombination", on_delete=models.PROTECT)
    studentid = models.CharField(max_length=30)
    
    def clean(self):
        # Check if the user is current
        if not self.user.current:
            raise ValidationError("User must have current=True to be assigned as a student.")

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


    def __str__(self):
        return str(self.term_name)
    
#New Alumni and Kids at ASYV Database

# Kids model
class Kids(models.Model):
    names = models.CharField(max_length=500)
    age = models.IntegerField(default=0)

    def __str__(self):
        return str(self.names)
class Kids_alumni(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='kid_alumn')
    date_of_birth = models.CharField(max_length=200,default="")
    gender = models.CharField(max_length=500)
    reg_number = models.CharField(max_length=50,default="")
    other_emails = models.CharField(max_length=500,default="")
    other_phones = models.CharField(max_length=500,default="")
    father = models.CharField(max_length=500,default="")
    mother = models.CharField(max_length=500,default="")
    did_you_born_in_rwanda = models.BooleanField(default=True)
    place_of_birth_district_or_country = models.CharField(max_length=500,default="")
    place_of_birth_sector_or_city = models.CharField(max_length=500,default="")
    life = (
        ('A', 'Alive'),
        ('D', 'Died'),
    ) 
    life_status = models.CharField(max_length=2,choices=life,default="A")
    marital_status = models.CharField(max_length=500) 
    currresidence_in_rwanda = models.BooleanField(default=True)
    currresidence_district_or_country = models.CharField(max_length=500,default="")
    currresidence_sector_or_city = models.CharField(max_length=500,default="")
    kids = models.ManyToManyField(Kids, related_name="alumnikids",blank=True)
    family = models.ForeignKey(Family,on_delete=models.PROTECT, related_name="alumnifamily")
    combination = models.ManyToManyField(Combination,related_name="alumnicombs",blank=True)
    eps = models.ManyToManyField(Ep, related_name="kidsalumni",blank=True)
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
    
    
#school timetable
class Subject(models.Model):
    subject_name = models.CharField(max_length=100)
    
class Room(models.Model):
    room_name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.room_name

# TimeSlots model
class TimeSlots(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    def __str__(self):
        return str(self.start_time)+":"+str(self.end_time)
    
class Academic(models.Model):
    start_date = models.CharField(max_length=10)
    end_date = models.CharField(max_length=10)

    def __str__(self):
        return f"Academic Year: {self.start_date} - {self.end_date}"

# GradeTimeSlots model
class GradeTimeSlots(models.Model):
    day_of_week = models.CharField(max_length=10)
    activity = models.CharField(max_length=100)
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    timeslots = models.ForeignKey(TimeSlots, on_delete=models.CASCADE)

# TeacherCombinationGradeSubject model
class TeacherCombinationGradeSubject(models.Model):
    combination = models.ForeignKey(Combination, on_delete=models.PROTECT)
    gradetimeslots = models.ForeignKey(GradeTimeSlots, on_delete=models.PROTECT)
    teacher = models.ForeignKey(User, limit_choices_to=Q(is_teacher=True) | Q(is_librarian=True), on_delete=models.PROTECT)
    subject = models.ForeignKey(Subject, on_delete=models.PROTECT)
    academic = models.ForeignKey(Academic, on_delete=models.PROTECT, null=True)
    room = models.ForeignKey(Room, on_delete=models.PROTECT, null=True)
    
    
#Attendance management System
class Attendance(models.Model):
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    staff_id = models.ForeignKey(User, related_name='staff', on_delete=models.CASCADE)
    period = models.IntegerField()  # Change to IntegerField
    date = models.DateField() 
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ]
    
    status = models.CharField(
        max_length=7, 
        choices=STATUS_CHOICES, 
        default='present'
    )
    comment = models.CharField(max_length=500,default="")
    created_at = models.DateTimeField(default=timezone.now)  # Add created_at field
    
#New way of doing attendance
class AttendanceTaken(models.Model):
    teachercombinationgradesubject = models.ForeignKey('TeacherCombinationGradeSubject', on_delete=models.CASCADE)
    date = models.DateField()
    absentees = models.ManyToManyField('Absenteeism', blank=True, related_name="attendance_records")

    class Meta:
        unique_together = ('teachercombinationgradesubject', 'date')

    def __str__(self):
        return f"Attendance taken on {self.date} by {self.teachercombinationgradesubject}"

class Absenteeism(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    status = models.CharField(max_length=100)
    school_comments = models.ManyToManyField('AttendanceComment', blank=True)

    def __str__(self):
        return f"Absenteeism for {self.student} - Status: {self.status}"
    


class AttendanceComment(models.Model):
    comment = models.TextField()
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)  # End time can be null

    def __str__(self):
        return self.comment
    

#English Access Program
class School(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class EapClass(models.Model):
    name = models.CharField(max_length=100)
    academic_year = models.IntegerField()
    
    class Meta:
        unique_together = ['name', 'academic_year']

    def __str__(self):
        return f"{self.name} - {self.academic_year})"

class Eap(models.Model):
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    # New field
    current_class = models.ForeignKey(EapClass, on_delete=models.PROTECT, null=True)
    student_school = models.ForeignKey(School, on_delete=models.PROTECT , null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class EapAbsenteeism(models.Model):
    STATUSES = [
        ('absent', 'Absent'),
        ('late', 'Late')
    ]
    student = models.ForeignKey(Eap, on_delete=models.PROTECT)
    status = models.CharField(max_length=10, choices=STATUSES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.status} on {self.date}"

class EapAttendance(models.Model):
    date = models.DateField(default=timezone.now)
    absentees = models.ManyToManyField(EapAbsenteeism)
    created_at = models.DateTimeField(auto_now_add=True)
    staff = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.eap_class} attendance on {self.date}"

