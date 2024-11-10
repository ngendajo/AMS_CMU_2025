from rest_framework import serializers
from api.models import User
from userprofile.models import *
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist


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
        #print(level_data)
        if(level_data=="is_crc"):
            user = User.objects.create_crcuser(**validated_data)
            CrcProfile.objects.create(
                user=user,
                position=profile_data,
            )
        elif(level_data=="is_superuser"):
            img_data = validated_data.pop('image_url')
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

#Count Alumni by gender education and employment
class AlumniCountSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    male_count = serializers.IntegerField()
    female_count = serializers.IntegerField()
    C = serializers.IntegerField()
    A1 = serializers.IntegerField()
    A0 = serializers.IntegerField()
    M = serializers.IntegerField()
    PHD = serializers.IntegerField()
    NMS = serializers.IntegerField()
    D = serializers.IntegerField()
    N = serializers.IntegerField()
    S= serializers.IntegerField()
    F = serializers.IntegerField()
    P = serializers.IntegerField()
    I = serializers.IntegerField()
    U = serializers.IntegerField()
    DEM = serializers.IntegerField()
    NEM = serializers.IntegerField()
    
#Count Alumni by grades
class AlumniCountByGradeSerializer(serializers.Serializer):
    grade_name = serializers.CharField()
    male = serializers.IntegerField()
    female = serializers.IntegerField()
    
class AlumniCountByCombinationSerializer(serializers.Serializer):
    combination_name = serializers.CharField()
    male = serializers.IntegerField()
    female = serializers.IntegerField()
    total = serializers.IntegerField()
    
#Employment status by grades
class EmploymentStatusByGradeSerializer(serializers.Serializer):
    grade_name = serializers.CharField()
    diedmale = serializers.IntegerField()
    diedfemale = serializers.IntegerField()
    empmale = serializers.IntegerField()
    empfemale = serializers.IntegerField()
    unempmale = serializers.IntegerField()
    unempfemale = serializers.IntegerField()
    
#Employment status by families
class EmploymentStatusByFamilySerializer(serializers.Serializer):
    family_name = serializers.CharField()
    diedmale = serializers.IntegerField()
    diedfemale = serializers.IntegerField()
    empmale = serializers.IntegerField()
    empfemale = serializers.IntegerField()
    unempmale = serializers.IntegerField()
    unempfemale = serializers.IntegerField()
    
#Employment status by combinations
class EmploymentStatusByCombinationSerializer(serializers.Serializer):
    combination_name = serializers.CharField()
    diedmale = serializers.IntegerField()
    diedfemale = serializers.IntegerField()
    empmale = serializers.IntegerField()
    empfemale = serializers.IntegerField()
    unempmale = serializers.IntegerField()
    unempfemale = serializers.IntegerField()
    
     
#Studies status by grades
class StudieStatusByGradeSerializer(serializers.Serializer):
    grade_name = serializers.CharField()
    diedmale = serializers.IntegerField()
    diedfemale = serializers.IntegerField()
    stumale = serializers.IntegerField()
    stufemale = serializers.IntegerField()
    nstumale = serializers.IntegerField()
    nstufemale = serializers.IntegerField()
    
#Studies status by families
class StudieStatusByFamilySerializer(serializers.Serializer):
    family_name = serializers.CharField()
    diedmale = serializers.IntegerField()
    diedfemale = serializers.IntegerField()
    stumale = serializers.IntegerField()
    stufemale = serializers.IntegerField()
    nstumale = serializers.IntegerField()
    nstufemale = serializers.IntegerField()
    
#Studies status by combinations
class StudieStatusByCombinationSerializer(serializers.Serializer):
    combination_name = serializers.CharField()
    diedmale = serializers.IntegerField()
    diedfemale = serializers.IntegerField()
    stumale = serializers.IntegerField()
    stufemale = serializers.IntegerField()
    nstumale = serializers.IntegerField()
    nstufemale = serializers.IntegerField()
    
#Studies and employment status by grades
class StudieEmployStatusByGradeSerializer(serializers.Serializer):
    grade_name = serializers.CharField()
    ac = serializers.CharField()
    empstumale = serializers.IntegerField()
    empstufemale = serializers.IntegerField()
    empnstumale = serializers.IntegerField()
    empnstufemale = serializers.IntegerField()
    unempstumale = serializers.IntegerField()
    unempstufemale = serializers.IntegerField()
    unempnstumale = serializers.IntegerField()
    unempnstufemale = serializers.IntegerField()
    diedmale = serializers.IntegerField()
    diedfemale = serializers.IntegerField()


#Employment serializers

class EmploymentSerializer(serializers.ModelSerializer):
    end_date = serializers.CharField(allow_blank=True, required=False)
    class Meta:
        model = Employment
        fields = '__all__'

class EmploymentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment
        fields=('title','status','company','career') #add then later ,'description','company','start_date','end_date'

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
    reg_number = serializers.CharField(max_length=50, required=True)
    image_url =serializers.ImageField(required=True)
    grade_name = serializers.CharField(max_length=200, required=True)
    family_name = serializers.CharField(max_length=200, required=True)
    combination_name = serializers.CharField(max_length=200, required=True)
    title = serializers.CharField(max_length=200, required=True)
    company = serializers.CharField(max_length=200, required=True)
    description = serializers.CharField(max_length=5000, required=True)
    start_date = serializers.CharField(max_length=200, required=True)
    status = serializers.CharField(max_length=30, required=True)
    emp_id = serializers.IntegerField(required=True)
    alumn_id = serializers.IntegerField(required=True)
    end = serializers.CharField(max_length=200, required=True)
    career = serializers.CharField(max_length=200, required=True)

    class Meta:
        fields = ('id','alumn_id', 'email','phone1', 'first_name','reg_number','last_name','end','image_url','grade_name','family_name','combination_name', 'title','company','description','start_date','status', 'emp_id','career')
        
#Donation track
class SampleMoMoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SampleMoMoCode
        fields = ['id', 'code']
class UserDonateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'email']

class FamilyDonateSerializer(serializers.ModelSerializer):
    grade = serializers.CharField(source='grade.grade_name')

    class Meta:
        model = Family
        fields = ['family_name', 'grade']

class CombinationDonateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Combination
        fields = ['combination_name']

class AlumniDonateSerializer(serializers.ModelSerializer):
    user = UserDonateSerializer()
    family = FamilyDonateSerializer()
    combination = CombinationDonateSerializer()

    class Meta:
        model = Alumni
        fields = ['user', 'family', 'combination']

class SampleDonationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.alumn.user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.alumn.user.last_name', read_only=True)
    email = serializers.EmailField(source='user.alumn.user.email', read_only=True)
    grade = serializers.CharField(source='user.alumn.family.grade.grade_name', read_only=True)
    family = serializers.CharField(source='user.alumn.family.family_name', read_only=True)
    combination = serializers.CharField(source='user.alumn.combination.combination_name', read_only=True)

    class Meta:
        model = SampleDonation
        fields = ['id', 'user', 'amount', 'sampleMoMoCode', 'confirmed', 'first_name', 'last_name', 'email', 'grade', 'family', 'combination']

#mentorship program
class MentorshipCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorshipCard
        fields = '__all__'

class SampleApplicationsDataSerializer(serializers.ModelSerializer):
    user = UserDonateSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        source='user',
        queryset=User.objects.all(),
        write_only=True
    )  # Include user ID for input

    class Meta:
        model = SampleApplicationsData
        fields = ['id', 'mentorship', 'user', 'user_id', 'is_approved']

# Alumni data serializers

class AlumniInfoRegSerializer(serializers.ModelSerializer):
    Eps = EpSerializer(many=True, read_only=True)
    class Meta:
        model = Alumni
        fields = ('id','date_of_birth','user','marital_status','gender','family','combination','Eps','kids','father','mother','reg_number','did_you_born_in_rwanda','place_of_birth_district_or_country','place_of_birth_sector_or_city','currresidence_in_rwanda','currresidence_district_or_country','currresidence_sector_or_city','s4marks','s5marks','s6marks','ne','maxforne','decision','life_status')

class AlumniInfoUpdateSerializer(serializers.ModelSerializer):
    Eps = EpSerializer(many=True, read_only=True)
    class Meta:
        model = Alumni
        fields = ('id','marital_status','gender','family','combination','Eps','kids','father','mother','reg_number','place_of_birth','currresidence','s4marks','s5marks','s6marks','ne','maxforne','decision','life_status')

class AlumniListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = ('decision','reg_number','date_of_birth','life_status','id','user','marital_status','reg_number','gender','family','combination','eps','kids','father','mother','did_you_born_in_rwanda','place_of_birth_district_or_country','place_of_birth_sector_or_city','currresidence_in_rwanda','currresidence_district_or_country','currresidence_sector_or_city','s4marks','s5marks','s6marks','ne','maxforne')
        depth = 3
class AlumniSerializer(serializers.ModelSerializer):
    image_url =serializers.ImageField(required=False)
    alumn = AlumniListSerializer()

    class Meta:
        model = User
        fields = ('id','is_crc','is_superuser','email','first_name','last_name','phone1', 'password','image_url','alumn')
        extra_kwargs = {'password': {'write_only': True}}

class AlumniListsSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    image_url =serializers.CharField(max_length=2000, required=True)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    phone1 = serializers.CharField(max_length=200, required=True)
    reg_number = serializers.CharField(max_length=200, required=True)
    alumn_id = serializers.CharField(max_length=200, required=True)
    grade_name = serializers.CharField(max_length=200, required=True)
    family_name = serializers.CharField(max_length=200, required=True)
    combination_name = serializers.CharField(max_length=200, required=True)
    family_id = serializers.IntegerField(required=True)
    grade_id=serializers.IntegerField(required=True)
    combination_id = serializers.IntegerField(required=True)
    career = serializers.CharField(max_length=500, required=True)

class AlumniListbyEPSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    image_url =serializers.ImageField(required=False)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    reg_number= serializers.CharField(max_length=200, required=True)
    phone1 = serializers.CharField(max_length=200, required=True)
    grade_name = serializers.CharField(max_length=200, required=True)
    family_name = serializers.CharField(max_length=200, required=True)
    combination_name = serializers.CharField(max_length=200, required=True)
    ep_title = serializers.CharField(max_length=200, required=True)
    ep_id = serializers.IntegerField(required=True)
    family_id = serializers.IntegerField(required=True)
    grade_id=serializers.IntegerField(required=True)
    combination_id = serializers.IntegerField(required=True)

    class Meta:
        model = User
        fields = ('id','email','image_url','first_name','last_name','phone1','reg_number', 'grade_name','grade_id','family_name','family_id','combination_name','combination_id','ep_title','ep_id')
        
 
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
    title = serializers.CharField(max_length=200, required=True)
    image_url =serializers.ImageField(required=True)
    description = serializers.CharField(max_length=1000, required=True)
    displayed = serializers.BooleanField(required=True)
    story_id = serializers.IntegerField(required=True)
    image= serializers.ImageField(required=True)
    video = serializers.FileField(required=True)
    draft = serializers.BooleanField(required=True)
 
    class Meta:
        fields = ('id', 'email','phone1', 'first_name','last_name','end','image_url', 'description','displayed','story_id')

#new way of handling stories
# serializers.py
class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'
        read_only_fields = ('id',)  # Ensure ID is read-only

    def validate(self, attrs):
        image = attrs.get('image')
        video = attrs.get('video')

        if image and video:
            raise serializers.ValidationError("Only one of image or video should be provided, not both.")

        return attrs

    def create(self, validated_data):
        return Story.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.displayed = validated_data.get('draft', instance.draft)
        instance.displayed = validated_data.get('displayed', instance.displayed)

        # Update either image or video field based on provided data
        instance.image = validated_data.get('image', instance.image)
        instance.video = validated_data.get('video', instance.video)

        instance.save()
        return instance

#end of stories

#Studie serializers

class StudyWithAlumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Studie
        fields = ('__all__')
        depth = 4

class StudieWithAlumnSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=True)
    alumn_id= serializers.IntegerField(required=True)
    email = serializers.EmailField(required=True)
    phone1 = serializers.CharField(max_length=30, required=True)
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    reg_number = serializers.CharField(max_length=200, required=True)
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
        fields = ('id','alumn_id','email','phone1','first_name','reg_number','last_name','image_url','level','degree','university','country','scholarship','status','study_id','scholarship_details')
class StudieSerializer(serializers.ModelSerializer):
    scholarship_details = serializers.CharField(allow_blank=True, required=False)
    class Meta:
        model = Studie
        fields = '__all__'
class UpdateStudieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studiedraft
        fields = ('level','degree','university','country','city','scholarship','status','scholarship_details')


#Dashboard needed data serializer
class TotalAlumnReportSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=True)
    gender = serializers.CharField(max_length=200, required=True)
    grade_name = serializers.CharField(max_length=200, required=True)
    family_name = serializers.CharField(max_length=200, required=True)
    combination_name = serializers.CharField(max_length=200, required=True)
    employed = serializers.CharField(max_length=200, required=True)
    end = serializers.CharField(max_length=200, required=True)
    degree = serializers.CharField(max_length=200, required=True)

    class Meta:
        model = User
        fields = ('id','gender','grade_name','family_name','combination_name','employed','end','degree')

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

class EmploymentAndStudieSerializer(serializers.ModelSerializer):

    gender = serializers.CharField(max_length=200, required=True)
    grade_name = serializers.CharField(max_length=200, required=True)
    emp= serializers.CharField(max_length=20, required=True)
    stu= serializers.CharField(max_length=20, required=True)
    id= serializers.IntegerField(required=True)

    class Meta:
        model = User
        fields = ('gender','grade_name','emp','stu','id')


class StudyReportSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=True)
    level = serializers.IntegerField(required=True)
    degree = serializers.CharField(max_length=200, required=True)


#Gallery serializers

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields=('__all__')


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = '__all__'

    def create(self, validated_data):
        # obtain data from validated_data
        user = validated_data.get('user')
        title = validated_data.get('title')
        op_type = validated_data.get('op_type')
        description = validated_data.get('description')
        diedline = validated_data.get('diedline')
        link = validated_data.get('link')
        post_time = validated_data.get('post_time')

        # create opportunity object
        opportunity = Opportunity.objects.create(
            user=user,
            title=title,
            op_type=op_type,
            description=description,
            diedline=diedline,
            link=link,
            post_time=post_time
        )

        return opportunity


class UpdateOpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ['title','op_type', 'description','diedline','link']
 

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
        
class PDFNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFNews
        fields = '__all__'

    def validate_pdf_file(self, value):
        # Check if the uploaded file is a PDF
        if value.content_type != 'application/pdf':
            raise serializers.ValidationError("Only PDF files are allowed.")
        return value

#Library management System

#Register a librarian or a teacher        
class TeacherOrLibrarianRegistrationSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(required=False)
    role = serializers.CharField(max_length=200,required=False)

    class Meta:
        model = User 
        fields = ('id', 'email', 'first_name', 'last_name', 'phone1', 'password', 'image_url', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role_data = validated_data.pop('role', None)  # Extract 'role' from validated_data
        image_url = validated_data.pop('image_url', None)  # Extract 'image_url' from validated_data

        if image_url:
            create_method = User.objects.create_user
        else:
            create_method = User.objects.create_user1

        if create_method == User.objects.create_user:
            user = create_method(image_url=image_url, **validated_data)
        else:
            user = create_method(**validated_data)

        if role_data == "librarian":
            user.is_librarian = True
        elif role_data == "teacher":
            user.is_teacher = True

        user.save()
        return user
    
#View a librarian or a teacher 
class TeacherAndLibrarianSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ('id', 'email', 'first_name', 'last_name', 'phone1', 'is_teacher', 'is_librarian', 'image_url')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Include instances that are either a teacher or a librarian
        if instance.is_teacher or instance.is_librarian:
            return data
        else:
            # Exclude instances that are neither a teacher nor a librarian
            return None
        
#Register a student        
class StudentRegistrationSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(required=False)
    studentid = serializers.CharField(max_length=200,required=False)
    combination = serializers.IntegerField(required=False)
    family_id = serializers.IntegerField(required=False)

    class Meta:
        model = User 
        fields = ('id', 'email', 'first_name', 'last_name', 'phone1', 'password', 'image_url', 'family_id', 'studentid', 'combination')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        family_id = validated_data.pop('family_id', None)
        combination_data = validated_data.pop('combination', None)
        studentid_data = validated_data.pop('studentid', None)
        image_url = validated_data.pop('image_url', None)

        if image_url:
            create_method = User.objects.create_user
        else:
            create_method = User.objects.create_user1

        if create_method == User.objects.create_user:
            user = create_method(image_url=image_url, **validated_data)
        else:
            user = create_method(**validated_data)

        if family_id and combination_data and studentid_data:
            user.is_student = True
            user.save()
            Student.objects.create(
                user=user,
                studentid=studentid_data,
                combination_id=combination_data,
                family_id=family_id
            )

        return user
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone1 = validated_data.get('phone1', instance.phone1)
        
        # Update image_url only if provided
        if 'image_url' in validated_data:
            instance.image_url = validated_data['image_url']
        
        instance.save()

        # Update related Student object if it exists
        student_data = {
            'studentid': validated_data.get('studentid', instance.student.studentid),
            'combination_id': validated_data.get('combination', instance.student.combination_id),
            'family_id': validated_data.get('family_id', instance.student.family_id)
        }

        try:
            student = instance.student
            for attr, value in student_data.items():
                setattr(student, attr, value)
            student.save()
        except ObjectDoesNotExist:
            pass  # Student object does not exist, no need to update

        return instance


    
#View students
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student 
        fields = '__all__'
        depth = 3
        
#author data serializer
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

#end author serilizer

#category data serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

#end category serilizer

#book data serializer
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        
class DisplayBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        depth=3

#end book serilizer

#Issue_Book data serializer
class Issue_BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue_Book
        fields = '__all__'
        
class DisplayIssue_BookSerializer(serializers.ModelSerializer):
    student_info = serializers.SerializerMethodField()

    class Meta:
        model = Issue_Book
        fields = ['id', 'book', 'borrower', 'library_number', 'issuedate', 'returndate', 'student_info']
        depth = 3

    def get_student_info(self, obj):
        try:
            student = obj.borrower.student  # Accessing the related Student through the User
            serializer = StudentSerializer(student)
            return serializer.data
        except Student.DoesNotExist:
            return None


#end Issue_Book serilizer

class CheckStudentSerializer(serializers.ModelSerializer):
    grade_name = serializers.CharField(source='student.family.grade.grade_name', max_length=200)
    family_name = serializers.CharField(source='student.family.family_name', max_length=200)
    combination_name = serializers.CharField(source='student.combination.combination_name', max_length=200)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'grade_name', 'family_name', 'combination_name')
        
class ChangeStudentPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data


class UsersSerializer(serializers.ModelSerializer):
    borrowings = DisplayIssue_BookSerializer(source='borrow.all', many=True)
    student_info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'is_active', 'is_staff', 'is_superuser', 'is_crc', 'is_alumni', 'is_student', 'is_teacher', 'is_librarian', 'first_name', 'last_name', 'phone1', 'image_url', 'borrowings','student_info')
        
    def get_student_info(self, obj):
        try:
            student = obj.student
            serializer = StudentSerializer(student)
            return serializer.data
        except Student.DoesNotExist:
            return None

#report data from library database    
class IssuedBookDisplaySerializer(serializers.Serializer):
    grade_name = serializers.CharField()
    studentid = serializers.CharField()
    family_name = serializers.CharField()
    combination_name = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()
    book_name = serializers.CharField()
    isbnumber = serializers.CharField()
    category_name = serializers.CharField()
    author_name = serializers.CharField()
    library_number = serializers.CharField()
    issuedate = serializers.CharField()
    returndate = serializers.CharField()
    id = serializers.IntegerField()
    
class StudentListDisplaySerializer(serializers.Serializer):
    grade_name = serializers.CharField()
    studentid = serializers.CharField()
    family_name = serializers.CharField()
    combination_name = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()
    id = serializers.IntegerField()
    grade_id = serializers.IntegerField()
    combination_id = serializers.IntegerField()
    eay = serializers.IntegerField()
    gender = serializers.CharField()
    
    
class BookListDisplaySerializer(serializers.Serializer):
    book_name = serializers.CharField()
    isbnumber = serializers.CharField()
    category_name = serializers.CharField()
    author_name = serializers.CharField()
    number_of_books = serializers.CharField()
    id = serializers.IntegerField()
    
class GeneralReportDisplaySerializer(serializers.Serializer):
    nbook_types = serializers.IntegerField()
    nbooks = serializers.IntegerField()
    nstudents = serializers.IntegerField()
    nissued_books = serializers.IntegerField()
    noverdue_books = serializers.IntegerField()
    
class MostBorrowerDisplaySerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    grade_name = serializers.CharField()
    family_name = serializers.CharField()
    combination_name = serializers.CharField()
    issue_count = serializers.IntegerField()
    
class BorrowerByGradeDisplaySerializer(serializers.Serializer):
    grade_name = serializers.CharField()
    family_name = serializers.CharField()
    combination_name = serializers.CharField()
    borrowers = serializers.IntegerField()
    students = serializers.IntegerField()
    
class AllBorrowersDisplaySerializer(serializers.Serializer):
    first_name=serializers.CharField()
    last_name=serializers.CharField()
    phone1=serializers.CharField()
    email=serializers.CharField()
    grade_name=serializers.CharField()
    family_name=serializers.CharField()
    combination_name=serializers.CharField()
    book_name=serializers.CharField()
    isbnumber=serializers.CharField()
    category_name=serializers.CharField()
    author_name=serializers.CharField()
    issuedate = serializers.CharField()
    returndate = serializers.CharField()
    student_id= serializers.IntegerField()
    user_id= serializers.IntegerField()
    is_student=serializers.BooleanField()
    is_alumni=serializers.BooleanField()
    is_staff=serializers.BooleanField()
    
   
   
   #Alumni update her/his profile     
class AlumniUpdateHisOrHerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = ('marital_status', 'kids', 'currresidence_in_rwanda', 'currresidence_district_or_country', 'currresidence_sector_or_city')
        
#new models (Announcement, Inquiries, frequentlyaskedquestions, Groups )
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = '__all__'

class FrequentlyAskedQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrequentlyAskedQuestion
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        
        
        
# Data updating process
class AlumniUpdatingExcelUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

class EmploymentdraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employmentdraft
        fields = '__all__'
        
class Employmentdraft1Serializer(serializers.ModelSerializer):
    class Meta:
        model = Employmentdraft
        fields = '__all__'
        depth = 2

class StudiedraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studiedraft
        fields = '__all__'
class Studiedraft1Serializer(serializers.ModelSerializer):
    class Meta:
        model = Studiedraft
        fields = '__all__'
        depth = 2
        
#school timetable
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class TimeSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlots
        fields = '__all__'

class GradeTimeSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeTimeSlots
        fields = '__all__'

class TeacherCombinationGradeSubjectSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source="room.room_name", read_only=True)
    subject_name = serializers.CharField(source="subject.subject_name", read_only=True)
    teacher_last_name = serializers.CharField(source="teacher.last_name", read_only=True)
    teacher_first_name = serializers.CharField(source="teacher.first_name", read_only=True)

    class Meta:
        model = TeacherCombinationGradeSubject
        fields = [
            'id', 'room', 'room_name', 'subject', 'subject_name', 'teacher',
            'teacher_last_name', 'teacher_first_name', 'academic', 'combination', 'gradetimeslots'
        ]
        
class AcademicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Academic
        fields = '__all__'
        
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
        
#Attendance management System
class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['student_id', 'staff_id', 'period', 'date','status','comment']
 
class AttendanceDetailSerializer(serializers.ModelSerializer):
    student_first_name = serializers.CharField(source='student_id.user.first_name', read_only=True)
    student_last_name = serializers.CharField(source='student_id.user.last_name', read_only=True)
    gender = serializers.CharField(source='student_id.user.gender', read_only=True)
    studentid = serializers.CharField(source='student_id.studentid', read_only=True)
    family_name = serializers.CharField(source='student_id.family.family_name', read_only=True)
    grade_name = serializers.CharField(source='student_id.family.grade.grade_name', read_only=True)
    end_academic_year = serializers.CharField(source='student_id.family.grade.end_academic_year', read_only=True)
    combination_name = serializers.CharField(source='student_id.combination.combination_name', read_only=True)
    staff_first_name = serializers.CharField(source='staff_id.first_name', read_only=True)
    staff_last_name = serializers.CharField(source='staff_id.last_name', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'studentid', 'student_first_name', 'student_last_name',
            'family_name', 'grade_name', 'combination_name',
            'staff_first_name', 'staff_last_name', 'period','comment','created_at', 'date', 'id','gender','status','end_academic_year'
        ]
        
#English Access Program
class EapSerializer(serializers.ModelSerializer):
    school = serializers.CharField(source='student_school.name', read_only=True)
    eap_class = serializers.CharField(source='current_class.name', read_only=True)

    class Meta:
        model = Eap
        fields = ['id', 'first_name', 'last_name', 'school', 'eap_class']

       
#new way of taking attendance
class TimetableSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    grade_id = serializers.SerializerMethodField()
    grade_name = serializers.SerializerMethodField()
    combination_id = serializers.SerializerMethodField()
    combination_name = serializers.SerializerMethodField()
    subject_id = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    teacher_first_name = serializers.SerializerMethodField()
    teacher_last_name = serializers.SerializerMethodField()
    teacher_id = serializers.SerializerMethodField()
    room_id = serializers.SerializerMethodField()
    room_name = serializers.SerializerMethodField()
    activity = serializers.SerializerMethodField()
    day_of_week = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()
    attendancetaken_id = serializers.SerializerMethodField()
    dat = serializers.SerializerMethodField()
    absentees = serializers.SerializerMethodField()

    class Meta:
        model = TeacherCombinationGradeSubject
        fields = [
            'id',
            'grade_id', 'grade_name',
            'combination_id', 'combination_name',
            'subject_id', 'subject_name','teacher_first_name',
            'teacher_last_name','teacher_id',
            'room_id', 'room_name',
            'activity', 'day_of_week',
            'start_time', 'end_time',
            'attendancetaken_id',
            'dat',
            'absentees'
        ]

    def get_grade_id(self, obj):
        return obj.gradetimeslots.grade.id if obj.gradetimeslots and obj.gradetimeslots.grade else None

    def get_grade_name(self, obj):
        return obj.gradetimeslots.grade.grade_name if obj.gradetimeslots and obj.gradetimeslots.grade else None

    def get_combination_id(self, obj):
        return obj.combination.id if obj.combination else None

    def get_combination_name(self, obj):
        return obj.combination.combination_name if obj.combination else None
    
    def get_teacher_first_name(self, obj):
        return obj.teacher.first_name if obj.teacher else None
    
    def get_teacher_last_name(self, obj):
        return obj.teacher.last_name if obj.teacher else None
    def get_teacher_id(self, obj):
        return obj.teacher.id if obj.teacher else None

    def get_subject_id(self, obj):
        return obj.subject.id if obj.subject else None

    def get_subject_name(self, obj):
        return obj.subject.subject_name if obj.subject else None

    def get_room_id(self, obj):
        return obj.room.id if obj.room else None

    def get_room_name(self, obj):
        return obj.room.room_name if obj.room else None

    def get_activity(self, obj):
        return obj.gradetimeslots.activity if obj.gradetimeslots else None

    def get_day_of_week(self, obj):
        return obj.gradetimeslots.day_of_week if obj.gradetimeslots else None

    def get_start_time(self, obj):
        return obj.gradetimeslots.timeslots.start_time.strftime('%H:%M') if obj.gradetimeslots and obj.gradetimeslots.timeslots else None

    def get_end_time(self, obj):
        return obj.gradetimeslots.timeslots.end_time.strftime('%H:%M') if obj.gradetimeslots and obj.gradetimeslots.timeslots else None

    def get_attendancetaken_id(self, obj):
        return getattr(obj, 'attendancetaken_id', None)

    def get_dat(self, obj):
        return self.context.get('dat', None)

    def get_absentees(self, obj):
    # Get the date from the context, which was passed as 'dat' in the request
        date_param = self.context.get('dat')
        
        if date_param:
            try:
                parsed_date = datetime.strptime(date_param, '%Y-%m-%d').date()
                
                # Get the AttendanceTaken record for this subject and date
                attendance_taken = AttendanceTaken.objects.filter(
                    teachercombinationgradesubject=obj,
                    date=parsed_date
                ).first()  # Get the first matching attendance record
                
                if attendance_taken:
                    # Get all absentees associated with this attendance record
                    absentees = attendance_taken.absentees.all()
                    return [{'student': absentee.student.id, 'status': absentee.status} for absentee in absentees]
            
            except ValueError:
                # If the date format is invalid, return an empty list
                return []

        return []  # Return an empty list if no date is provided or other issues occur
class AttendanceTakenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceTaken
        fields = ['id', 'teachercombinationgradesubject', 'date', 'absentees']

class AbsenteeismSerializer(serializers.ModelSerializer):
    class Meta:
        model = Absenteeism
        fields = ['id', 'student', 'status', 'school_comments']

class AttendanceCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceComment
        fields = ['id', 'comment', 'start_time', 'end_time']  # Include start_time and end_time
        
        
class StudentListSerializer(serializers.ModelSerializer):
    student_user_first_name = serializers.CharField(source='user.first_name')
    student_user_last_name = serializers.CharField(source='user.last_name')
    student_studentid = serializers.CharField(source='studentid')
    student_id = serializers.CharField(source='id')
    student_combination_id = serializers.IntegerField(source='combination_id')
    student_family_grade_id = serializers.SerializerMethodField()
    tcgs_id = serializers.IntegerField(read_only=True)
    absenteeism = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'student_user_first_name',
            'student_user_last_name',
            'student_studentid',
            'student_id',
            'student_combination_id',
            'student_family_grade_id',
            'tcgs_id',
            'absenteeism'
        ]

    def get_student_family_grade_id(self, obj):
        return obj.family.grade.id if obj.family and obj.family.grade else None

    def get_absenteeism(self, obj):
        date = self.context.get('date')
        tcgs_id = self.context.get('tcgs_id')
        
        if not date or not tcgs_id:
            return None

        # Get attendance record for the specific date and TCGS
        attendance = AttendanceTaken.objects.filter(
            teachercombinationgradesubject_id=tcgs_id,
            date=date
        ).first()

        if not attendance:
            return None

        # Get absenteeism record for this student in the attendance
        absenteeism = attendance.absentees.filter(student=obj).first()
        
        if not absenteeism:
            return None

        return AbsenteeismSerializer(absenteeism).data
    
#AttendanceReport
class AttendanceReportSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    studentid = serializers.CharField(source='student.studentid')
    first_name = serializers.CharField(source='student.user.first_name')
    last_name = serializers.CharField(source='student.user.last_name')
    gender = serializers.CharField(source='student.user.gender')
    family_name = serializers.CharField(source='student.family.family_name')
    grade_name = serializers.CharField(source='student.family.grade.grade_name')
    combination_name = serializers.CharField(source='student.combination.combination_name')
    activity = serializers.SerializerMethodField()
    teacher_first_name = serializers.SerializerMethodField()
    teacher_last_name = serializers.SerializerMethodField()
    absenteeism_status = serializers.CharField(source='status')

    class Meta:
        model = Absenteeism
        fields = [
            'date', 'studentid', 'first_name', 'last_name', 'gender',
            'family_name', 'grade_name', 'combination_name', 'activity',
            'teacher_first_name', 'teacher_last_name', 'absenteeism_status'
        ]

    def get_date(self, obj):
        # Get the first attendance record if available
        attendance_record = obj.attendance_records.first()
        return attendance_record.date if attendance_record else None

    def get_activity(self, obj):
        attendance_record = obj.attendance_records.first()
        return (
            attendance_record.teachercombinationgradesubject.gradetimeslots.activity
            if attendance_record else None
        )

    def get_teacher_first_name(self, obj):
        attendance_record = obj.attendance_records.first()
        return (
            attendance_record.teachercombinationgradesubject.teacher.first_name
            if attendance_record else None
        )

    def get_teacher_last_name(self, obj):
        attendance_record = obj.attendance_records.first()
        return (
            attendance_record.teachercombinationgradesubject.teacher.last_name
            if attendance_record else None
        )

