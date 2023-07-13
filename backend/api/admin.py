from django.contrib import admin
from import_export import resources
from import_export.admin import ExportActionMixin
from .models import User
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django import forms
from api.models import User
from userprofile.models import *
from django.contrib.auth import get_user_model

User = get_user_model()

# Register your models here.

class PostResource(resources.ModelResource):
    class Meta:
        model = User
        fields = ('email','id','first_name','last_name','phone1','image_url')
        export_order = fields

class PostAdmin(ExportActionMixin,admin.ModelAdmin):
    resource_class = PostResource


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email','id','first_name','last_name','phone1','image_url')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('email','id', 'password','first_name','last_name','phone1','image_url')

    #def clean_password(self):
    #    return self.initial["password"]

@admin.register(User)
class UserAdmin(ImportExportModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email','password','id','first_name','last_name','phone1','is_active','is_staff','is_superuser','is_crc','is_alumni','image_url')
    list_filter = ('is_superuser', )
    fieldsets = (
        (None, {'fields': ('email', 'password',)}),
        ('Permissions', {'fields': ('is_superuser',)}),
        ('First Name', {'fields': ('first_name', )}),
        ('Last Name', {'fields': ('last_name', )}),
        ('phone1', {'fields': ('phone1', )}),
        ('is_active', {'fields': ('is_active', )}),
        ('is_staff', {'fields': ('is_staff', )}),
        ('is_crc', {'fields': ('is_crc', )}),
        ('is_alumni', {'fields': ('is_alumni', )}),
        ('image_url', {'fields': ('image_url', )}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','id',  'password1', 'password2', 'first_name','last_name', 'phone1','phone2','image_url'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()

@admin.register(CrcProfile)
class CrcAdmin(ImportExportModelAdmin):
    list_display =('user','id','position')

@admin.register(Grade)
class GradeAdmin(ImportExportModelAdmin):
    list_display =('grade_name','id','start_academic_year','end_academic_year')

@admin.register(Family)
class FamilyAdmin(ImportExportModelAdmin):
    list_display =('family_name','id','grade','family_number','family_mother','family_mother_tel')

@admin.register(Combination)
class CombinationAdmin(ImportExportModelAdmin):
    list_display =('id','combination_name')

@admin.register(Ep)
class EpAdmin(ImportExportModelAdmin):
    list_display =('id','title','type')

@admin.register(Event)
class EventAdmin(ImportExportModelAdmin):
    list_display =('id','description')

@admin.register(Story)
class StoryAdmin(ImportExportModelAdmin):
    list_display =('id','description')

@admin.register(Alumni)
class AlumniAdmin(ImportExportModelAdmin):
    list_display =('id','gender')

@admin.register(Studie)
class StudieAdmin(ImportExportModelAdmin):
    list_display=('id','university','alumn','level','university','scholarship','country','status')

@admin.register(Employment)
class EmploymentAdmin(ImportExportModelAdmin):
    list_display=('id','title')

@admin.register(Gallery)
class  GalleryAdmin(ImportExportModelAdmin):
    list_display=('id','image_url','displayed')