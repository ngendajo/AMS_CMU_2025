from rest_framework import serializers
from api.models import User
from userprofile.models import CrcProfile, Grade, Family, Combination, Ep, Alumni, Opportunity, Event, Employment, Studie, Story, Gallery, News
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model


User = get_user_model()


#User management serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')

#managing staff serializers
class StaffRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrcProfile
        fields = ('__all__')
        depth = 2

class StaffUserSerializer(serializers.ModelSerializer):
    image_url =serializers.ImageField(required=False)
    profile = StaffRoleSerializer()

    class Meta:
        model = User
        fields = ('id','is_crc','is_superuser','email','first_name','last_name','phone1', 'password','image_url','profile')
        extra_kwargs = {'password': {'write_only': True}}

class StaffUserRegistrationSerializer(serializers.ModelSerializer):
    profile = serializers.CharField()
    level = serializers.CharField(required=False)
    image_url =serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ('email','first_name','last_name','phone1', 'password','profile','image_url','level')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        level_data = validated_data.pop('level')
        print(level_data)
        if(level_data=="is_crc"):
            user = User.objects.create_crcuser(**validated_data)
            CrcProfile.objects.create(
                user=user,
                position=profile_data,
            )
        elif(level_data=="is_superuser"):
            user = User.objects.create_superuser(**validated_data)
            CrcProfile.objects.create(
                user=user,
                position=profile_data,
            )
        else:
            user = User.objects.create_staffuser(**validated_data)
            CrcProfile.objects.create(
                user=user,
                position=profile_data,
            )
        return user
    
    #End managing staff


#EP data serialisers
class EpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ep
        fields = ('id','title','type')

    #end

#combination data serializer
class CombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Combination
        fields = '__all__'

#end combination serilizer

#Grades and families data serializers

class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields=('__all__')
        depth = 1 

        

class GradeSerializers(serializers.ModelSerializer):
    families=FamilySerializer(many=True,required=False)

    class Meta:
        model = Grade
        fields = ('id','grade_name','start_academic_year','end_academic_year','families')

    def create(self, validated_data):
        families_data = validated_data.pop('families')
        grade = Grade.objects.create(**validated_data)
        for f in families_data:
            Family.objects.create(
            grade=grade,
            family_name=f['family_name'],
            family_number=f['family_number'],
            family_mother=f['family_mother'],
            family_mother_tel=f['family_mother_tel']
        )
        return grade
    
class AddFamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields=('grade','family_name','family_number','family_mother','family_mother_tel')
    
    
#End of grades and families  


#Employment serializers

class EmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment
        fields=('__all__')

class EmploymentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment
        fields=('title','status','description','company','start_date','end_date','career')

class EmploymentDisplayOneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment
        fields=('__all__')
        depth =4

class DisplayEmploymentSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    phone1 = serializers.CharField(max_length=30, required=True)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    image_url =serializers.ImageField(required=True)
    title = serializers.CharField(max_length=200, required=True)
    company = serializers.CharField(max_length=200, required=True)
    description = serializers.CharField(max_length=5000, required=True)
    start_date = serializers.CharField(max_length=200, required=True)
    status = serializers.CharField(max_length=30, required=True)
    emp_id = serializers.IntegerField(required=True)
    end = serializers.CharField(max_length=200, required=True)
    career = serializers.CharField(max_length=200, required=True)

    class Meta:
        fields = ('id', 'email','phone1', 'first_name','last_name','end','image_url', 'title','company','description','start_date','status', 'emp_id','career')

# Alumni data serializers

class AlumniInfoRegSerializer(serializers.ModelSerializer):
    Eps = EpSerializer(many=True, read_only=True)
    class Meta:
        model = Alumni
        fields = ('id','user','marital_status','gender','family','combination','Eps','kids','father','mother','place_of_birth','currresidence','s4marks','s5marks','s6marks','ne','maxforne')

class AlumniInfoUpdateSerializer(serializers.ModelSerializer):
    Eps = EpSerializer(many=True, read_only=True)
    class Meta:
        model = Alumni
        fields = ('id','marital_status','gender','family','combination','Eps','kids','father','mother','place_of_birth','currresidence','s4marks','s5marks','s6marks','ne','maxforne')

class AlumniListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = '__all__'
        depth = 2
class AlumniSerializer(serializers.ModelSerializer):
    image_url =serializers.ImageField(required=False)
    alumn = AlumniListSerializer()

    class Meta:
        model = User
        fields = ('id','is_crc','is_superuser','email','first_name','last_name','phone1', 'password','image_url','alumn')
        extra_kwargs = {'password': {'write_only': True}}

class AlumniListsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    image_url =serializers.ImageField(required=False)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    phone1 = serializers.CharField(max_length=200, required=True)
    grade_name = serializers.CharField(max_length=200, required=True)
    family_name = serializers.CharField(max_length=200, required=True)

    class Meta:
        model = User
        fields = ('id','email','image_url','first_name','last_name','phone1', 'grade_name','family_name')
        

class AlumniBulkRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User 
        fields = ('id','email','first_name','last_name','phone1', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_alumniuserwithoutimage(**validated_data)
        return user

class AlumniRegistrationSerializer(serializers.ModelSerializer):
    image_url =serializers.ImageField(required=False)

    class Meta:
        model = User 
        fields = ('id','email','first_name','last_name','phone1', 'password','image_url')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_alumniuser(**validated_data)
        return user
    

#Update user
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email','first_name','last_name','phone1')


class UpdateUserImageUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('image_url',)

    #User login serialisers

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(style={"input_type": "password"}, required=True)
    new_password = serializers.CharField(style={"input_type": "password"}, required=True)

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError({'current_password': 'Does not match'})
        return value

#reset password
class EmailSerilizer(serializers.Serializer):
    email = serializers.EmailField()
    class Meta:
        fields = ('email',)

class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        fields = ("password",)

    def validate(self, data):
        password = data.get("password")
        token = self.context.get("kwargs").get("token")
        encoded_pk = self.context.get("kwargs").get("encoded_pk")
        
        if token is None or encoded_pk is None:
            serializers.ValidationError("Missing data")

        pk = urlsafe_base64_decode(encoded_pk).decode()
        user = User.objects.get(pk=pk)

        if not PasswordResetTokenGenerator().check_token(user, token):
            raise serializers.ValidationError("The token is invalid")
        
        user.set_password(password)
        user.save()
        return data
    

#Event seralizers

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('__all__')

class UpdateEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('title','description','date')


#Story serializers


class StoryWithAlumnSerializer(serializers.ModelSerializer):

    alumn=AlumniListSerializer(read_only=True)
    
    class Meta:
        model = Story
        fields = ('id','alumn','description','displayed')

class StorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Story
        fields = ('id','alumn','description','displayed')

class UpdateStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('description',)

class DisplayStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('displayed',)

class DisplayAllStoriesSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    phone1 = serializers.CharField(max_length=30, required=True)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    image_url =serializers.ImageField(required=True)
    description = serializers.CharField(max_length=1000, required=True)
    displayed = serializers.BooleanField(required=True)
    story_id = serializers.IntegerField(required=True)
 
    class Meta:
        fields = ('id', 'email','phone1', 'first_name','last_name','end','image_url', 'description','displayed','story_id')




#Studie serializers

class StudyWithAlumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Studie
        fields = ('__all__')
        depth = 4

class StudieWithAlumnSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    phone1 = serializers.CharField(max_length=30, required=True)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    image_url =serializers.ImageField(required=True)
    degree = serializers.CharField(max_length=200, required=True)
    university = serializers.CharField(max_length=200, required=True)
    country = serializers.CharField(max_length=200, required=True)
    scholarship = serializers.CharField(max_length=200, required=True)
    scholarship_details = serializers.CharField(max_length=200, required=True)
    status = serializers.CharField(max_length=200, required=True)
    study_id = serializers.IntegerField(required=True)
    level = serializers.CharField(max_length=50, required=True)

    class Meta:
        model = Studie
        fields = ('id','email','phone1','first_name','last_name','image_url','level','degree','university','country','scholarship','status','study_id','scholarship_details')



class StudieSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Studie
        fields = ('id','alumn','level','degree','university','country','scholarship','status','scholarship_details')


class UpdateStudieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studie
        fields = ('level','degree','university','country','scholarship','status','scholarship_details')


#Dashboard needed data serializer
class TotalAlumnReportSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=True)
    gender = serializers.CharField(max_length=200, required=True)
    employed = serializers.CharField(max_length=200, required=True)
    end = serializers.CharField(max_length=200, required=True)
    degree = serializers.CharField(max_length=200, required=True)

    class Meta:
        model = User
        fields = ('id','gender','employed','end','degree')

class TotalAlumnGradeSerializer(serializers.ModelSerializer):

    id= serializers.IntegerField(required=True)
    gender = serializers.CharField(max_length=200, required=True)
    grade = serializers.CharField(max_length=200, required=True)
    number= serializers.IntegerField(required=True)

    class Meta:
        model = User
        fields = ('id','gender','grade','number')


class GradesAndFamiliesSerializer(serializers.ModelSerializer):

    id= serializers.IntegerField(required=True)
    family_name = serializers.CharField(max_length=200, required=True)
    grade_name = serializers.CharField(max_length=200, required=True)
    start_academic_year = serializers.CharField(max_length=200, required=True)
    end_academic_year = serializers.CharField(max_length=200, required=True)

    class Meta:
        model = User
        fields = ('id','family_name','grade_name','start_academic_year','end_academic_year')


class StudyReportSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=True)
    level = serializers.IntegerField(required=True)
    degree = serializers.CharField(max_length=200, required=True)


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Studie
        fields = ('id','level','degree')


#Gallery serializers

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields=('__all__')

#Gallery serializers

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields=('__all__')

 
    def create(self, validated_data):
        image_url = validated_data.get('image_url')
        displayed = validated_data.get('displayed')

        gallery = Gallery.objects.create(
            image_url=image_url,
            displayed=displayed
        )

        return gallery


class UpdateGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['displayed']


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['id', 'user', 'title', 'description', 'post_time']

    def create(self, validated_data):
        # obtain data from validated_data
        user = validated_data.get('user')
        title = validated_data.get('title')
        description = validated_data.get('description')
        post_time = validated_data.get('post_time')

        # create opportunity object
        opportunity = Opportunity.objects.create(
            user=user,
            title=title,
            description=description,
            post_time=post_time
        )

        return opportunity


class UpdateOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['title', 'description']
 

class ApproveOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['approved']


# News
class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'


class UpdateNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('title', 'description', 'date', 'pinned')

