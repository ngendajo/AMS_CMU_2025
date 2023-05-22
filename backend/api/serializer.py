from rest_framework import serializers
from userprofile.models import CrcProfile
from api.models import User
from userprofile.models import CrcProfile
from django.contrib.auth import get_user_model

User = get_user_model()



class CrcSerializer(serializers.ModelSerializer):
    class Meta: 
        model = CrcProfile
        fields = ('position',)

class CrcListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrcProfile
        fields = '__all__'
        depth = 1

class CrcListSerializer1(serializers.ModelSerializer):
    profile = CrcListSerializer()
    class Meta:
        model = User
        fields = ('id','email','first_name','last_name','phone1', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}


class CrcRegistrationSerializer(serializers.ModelSerializer):

    profile = CrcSerializer()

    class Meta:
        model = User
        fields = ('email','first_name','last_name','phone1', 'password', 'profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create_crcuser(**validated_data)
        CrcProfile.objects.create(
            user=user,
            position=profile_data['position'],
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