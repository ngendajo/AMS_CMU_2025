from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


# Create your models here.

class UserManager(BaseUserManager):
	'''
	creating a manager for a custom user model
	'''
	def create_user1(self, email, first_name, last_name, phone1, password):
		"""
		Create and return a `User` with an email, username and password.
		"""
		if not email:
			raise ValueError('Users Must Have an email address')

		user = self.model(
			email=self.normalize_email(email),
			first_name=first_name,
			last_name=last_name,
			phone1=phone1,
		)
		user.set_password(password)
		user.save(using=self._db)
		return user
	
	def create_user(self, email, first_name, last_name, phone1, password, image_url):
		"""
		Create and return a `User` with an email, username and password.
		"""
		if not email:
			raise ValueError('Users Must Have an email address')

		user = self.model(
			email=self.normalize_email(email),
			first_name=first_name,
			last_name=last_name,
			phone1=phone1,
		)
		if image_url:
			user.image_url = image_url
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, first_name, last_name, phone1, password):
		"""
		Create and return a `User` with superuser (admin) permissions.
		"""
		if password is None:
			raise TypeError('Superusers must have a password.')

		user = self.create_user1(email, first_name, last_name, phone1, password)
		user.is_superuser = True
		user.is_staff = True
		user.save()
		return user

	def create_crcuser(self, email, first_name, last_name, phone1, password, image_url):
		if password is None:
			raise TypeError('CRC staff must have a password')
		user = self.create_user(email, first_name, last_name, phone1, password, image_url)
		user.is_crc = True
		user.is_staff = True
		user.save()
		return user

	def create_alumniuser(self, email, first_name, last_name, phone1, password, image_url):
		if password is None:
			raise TypeError('Alumni must have a password')
		user = self.create_user(email, first_name, last_name, phone1, password, image_url)
		user.is_alumni = True
		user.save()
		return user
	
	def create_alumniuserwithoutimage(self, email, first_name, last_name, phone1, password):
		if password is None:
			raise TypeError('Alumni must have a password')
		user = self.create_user1(email, first_name, last_name, phone1, password)
		user.is_alumni = True
		user.save()
		return user

	def create_studentuser(self, email, first_name, last_name, phone1, password, image_url):
		if password is None:
			raise TypeError('Student must have a password')
		user = self.create_user(email, first_name, last_name, phone1, password, image_url)
		user.is_student = True
		user.save()
		return user
	
	def create_studentuserwithoutimage(self, email, first_name, last_name, phone1, password,gender):
		if password is None:
			raise TypeError('Student must have a password')
		user = self.create_user1(email, first_name, last_name, phone1, password)
		user.is_student = True
		user.gender = gender
		user.save()
		return user

	def create_staffuser(self, email, first_name, last_name, phone1, password, image_url):
		if password is None:
			raise TypeError('Staff must have a password')
		user = self.create_user(email, first_name, last_name, phone1, password, image_url)
		user.is_staff = True
		user.save()
		return user


class User(AbstractBaseUser):
	GENDER_CHOICES = [
		('M', 'Male'),
		('F', 'Female'),
		('O', 'Other'),  # You can add more options if needed
	]
	email = models.EmailField(
		verbose_name='email address',
		max_length=255,
		unique=True
	)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	current = models.BooleanField(default=True)  # New attribute with default value True
	gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='F')  # New gender attribute
	is_crc = models.BooleanField(default=False)
	is_alumni = models.BooleanField(default=False)
	is_student = models.BooleanField(default=False)
	is_teacher = models.BooleanField(default=False)
	is_librarian = models.BooleanField(default=False)
	first_name = models.CharField(max_length=200)
	last_name = models.CharField(max_length=200)
	phone1 = models.CharField(max_length=200, blank=True, unique=True)
	image_url = models.ImageField(upload_to='profiles', default='profiles/kayitesid787gmail.comMon_Jul_08_2024_160828_GMT0200_South_Africa_Standard_Time.jpeg')
	username = None
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name', 'last_name', 'phone1']

	# Tells Django that the UserManager class defined above should manage
	# objects of this type.
	objects = UserManager()

	def __str__(self):
		return self.email

	def has_perm(self, perm, obj=None):
		return self.is_superuser

	def has_module_perms(self, app_label):
		return self.is_superuser

