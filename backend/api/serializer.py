from rest_framework import serializers
from api.models import User
from userprofile.models import *
from django.contrib.auth import get_user_model

User = get_user_model()


#User management serializers

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

# Alumni data serializers

class AlumniInfoRegSerializer(serializers.ModelSerializer):
    Eps = EpSerializer(many=True, read_only=True)
    class Meta:
        model = Alumni
        fields = ('id','user','marital_status','gender','Family','Combination','Eps','kids','father','mother','place_of_birth','CurrResidence')

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



#Studie serializers

class StudieWithAlumnSerializer(serializers.ModelSerializer):

    alumn = serializers.StringRelatedField(many=False)

    class Meta:
        model = Studie
        fields = ('id','alumn','degree','university','country','scholarship','status')


class StudieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Studie
        fields = ('id','alumn','degree','university','country','scholarship','status')

class UpdateStudieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studie
        fields = ('degree','university','country','scholarship','status')


#Employment serializers

class EmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employment
        fields=('__all__')











