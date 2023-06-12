from rest_framework import serializers
from userprofile.models import CrcProfile
from api.models import User
from userprofile.models import CrcProfile,Grade,Family,Combination,Ep,Alumni
from django.contrib.auth import get_user_model

User = get_user_model()


    #EP data serialisers
class EpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ep
        fields = ('id','title','type')

class EpRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ep
        fields = ('title','type')

    
    #end

#User management serializers
class CrcListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrcProfile
        fields = '__all__'
        depth = 1


class CrcSerializer(serializers.ModelSerializer):
    class Meta: 
        model = CrcProfile
        fields = ('position',)

class AdminSerializer(serializers.ModelSerializer):
    image_url =serializers.ImageField(required=False)
    profile = CrcListSerializer()

    class Meta:
        model = User
        fields = ('id','is_crc','is_superuser','email','first_name','last_name','phone1', 'password','image_url','profile')
        extra_kwargs = {'password': {'write_only': True}}
class AdminRegistrationSerializer(serializers.ModelSerializer):
    image_url =serializers.ImageField(required=False)

    class Meta:
        model = User 
        fields = ('email','first_name','last_name','phone1', 'password','image_url')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_superuser(**validated_data)
        return user
    

class AlumniListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = '__all__'
        depth = 2

        

class AlumniInfoRegSerializer(serializers.ModelSerializer):
    Eps = EpSerializer(many=True, read_only=True)
    class Meta:
        model = Alumni
        fields = ('id','user','marital_status','gender','Family','Combination','Eps','kids','father','mother','place_of_birth','CurrResidence')


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
        fields = ('email','first_name','last_name','phone1', 'password','image_url')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_alumniuser(**validated_data)
        return user
    
class StaffRegistrationSerializer(serializers.ModelSerializer):
    image_url =serializers.ImageField(required=False)

    class Meta:
        model = User 
        fields = ('email','first_name','last_name','phone1', 'password','image_url')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_staffuser(**validated_data)
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



class CrcRegistrationSerializer(serializers.ModelSerializer):
    profile = serializers.CharField()
    image_url =serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ('email','first_name','last_name','phone1', 'password','profile','image_url')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_crcuser(**validated_data)
        CrcProfile.objects.create(
            user=user,
            position=profile_data,
        )
        return user
    

    #User login serialisers

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(style={"input_type": "password"}, required=True)
    new_password = serializers.CharField(style={"input_type": "password"}, required=True)

    def validate_current_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError({'current_password': 'Does not match'})
        return value
    
#combination data serializers
class CombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Combination
        fields = '__all__'

class CombinationRSerializer(serializers.ModelSerializer):
    class Meta:
        model = Combination
        fields = ('combination_name',)

    """ def create(self, validated_data):
        combination = Combination.objects.create(**validated_data)
        return combination """

#end
    


#Grades and families data serializers

class FamilyRSerializers(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields=('family_name','family_number','family_mother','family_mother_tel')
        depth = 1 
        

class FamilyRegistrationSerializers(serializers.ModelSerializer):
    family=FamilyRSerializers(many=True,required=False)

    class Meta:
        model = Grade
        fields = ('grade_name','start_academic_year','end_academic_year','family')

    def create(self, validated_data):
        family_data = validated_data.pop('family')
        grade = Grade.objects.create(**validated_data)
        for f in family_data:
            Family.objects.create(
            grade=grade,
            family_name=f['family_name'],
            family_number=f['family_number'],
            family_mother=f['family_mother'],
            family_mother_tel=f['family_mother_tel']
        )
        return grade
    

class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = '__all__'
        depth = 1 

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'

class AllFamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields ='__all__'
        depth=1

class AllGradeSerializer(serializers.ModelSerializer):
    families=AllFamilySerializer(read_only=True,many=True)
    class Meta:
        model = Grade
        fields ='__all__'
    
    #End