from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

# Create your models here.

class UserManager(BaseUserManager):
	'''
	creating a manager for a custom user model
	'''
	def create_user(self, email,first_name,last_name,phone1,phone2, password=None):
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
	        phone2=phone2,
		)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email,first_name,last_name,phone1,phone2, password):
		"""
		Create and return a `User` with superuser (admin) permissions.
		"""
		if password is None:
			raise TypeError('Superusers must have a password.')

		user = self.create_user(email,first_name,last_name,phone1,phone2, password)
		user.is_superuser = True
		user.is_staff = True
		user.save()
		return user

	def create_crcuser(self,email,first_name,last_name,phone1,phone2,password):
		if password is None:
			raise TypeError('CRC staff must have a password')
		user = self.create_user(email,first_name,last_name,phone1,phone2,password)
		user.is_crc = True
		user.is_staff = True
		user.save()
		return user


	def create_alumniuser(self,email,first_name,last_name,phone1,phone2,password):
		if password is None:
			raise TypeError('Alumni must have a password')
		user = self.create_user(email,first_name,last_name,phone1,phone2,password)
		user.is_alumni = True
		user.save()
		return user
		
class User(AbstractBaseUser):
	email = models.EmailField(
		verbose_name='email address',
		max_length=255,
		unique=True
	)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	is_crc = models.BooleanField(default=False)
	is_alumni = models.BooleanField(default=False)
	first_name=models.CharField(max_length=200)
	last_name=models.CharField(max_length=200)
	phone1=models.CharField(max_length=200, blank=True,unique=True)
	phone2=models.CharField(max_length=200, blank=True,unique=True)
	username=None
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name', 'last_name', 'phone1', 'phone2']

	# Tells Django that the UserManager class defined above should manage
	# objects of this type.
	objects = UserManager()

	def __str__(self):
		return self.email
	
	def has_perm(self, perm, obj=None):
		return self.is_superuser
	
	def has_module_perms(self, app_label):
		return self.is_superuser
