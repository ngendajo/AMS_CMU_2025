from django.contrib.auth import logout
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import status,generics, viewsets,response
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.db.models import Count, Case, When, IntegerField
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import UpdateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import connection
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework import generics
from .serializer import *
from userprofile.models import *
from .models import User
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import pandas as pd

from userprofile.models import Alumni

from django.http import JsonResponse

User = get_user_model()


# Create your views here.

# User data

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
        try:
            if request.query_params:
                user=User.objects.filter(**request.query_params.dict())
            else:
                user = User.objects.all()
        
            # if there is something in items else raise error
            if user:
                serializer = UserSerializer(user, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class AluminiBulkRegistrationView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = AlumniBulkRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AluminiRegistrationView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        print(request.data)
        serializer = AlumniRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            if request.query_params:
                user = User.objects.filter(**request.query_params.dict(), is_alumni=True)
            else:
                user = User.objects.filter(is_alumni=True)

            # if there is something in items else raise error
            if user:
                serializer = AlumniSerializer(user, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class AluminiListView(APIView):
    permission_classes = [IsAuthenticated, ]
    
    def get(self,request):
        try:
            if request.query_params:
                if(list(request.query_params.keys())[0]=="grade_id"):
                    user = User.objects.raw('''select api_user.id,api_user.email, api_user.image_url, api_user.first_name, api_user.last_name, api_user.phone1, userprofile_grade.grade_name,userprofile_grade.id as grade_id,userprofile_family.family_name, userprofile_family.id as family_id,userprofile_combination.combination_name,userprofile_combination.id as combination_id from api_user left outer join userprofile_alumni on api_user.id=userprofile_alumni.user_id left outer join userprofile_family on userprofile_alumni.family_id=userprofile_family.id left outer join userprofile_grade on userprofile_family.grade_id=userprofile_grade.id left outer join userprofile_combination on userprofile_alumni.combination_id=userprofile_combination.id where api_user.is_alumni and userprofile_grade.id=%s;''',[request.query_params.dict()["grade_id"]])
                    serializer = AlumniListsSerializer(user, many=True)
                    return Response(serializer.data)
                elif(list(request.query_params.keys())[0]=="family_id"):
                    user = User.objects.raw('''select api_user.id,api_user.email, api_user.image_url, api_user.first_name, api_user.last_name, api_user.phone1, userprofile_grade.grade_name,userprofile_grade.id as grade_id,userprofile_family.family_name, userprofile_family.id as family_id,userprofile_combination.combination_name,userprofile_combination.id as combination_id from api_user left outer join userprofile_alumni on api_user.id=userprofile_alumni.user_id left outer join userprofile_family on userprofile_alumni.family_id=userprofile_family.id left outer join userprofile_grade on userprofile_family.grade_id=userprofile_grade.id left outer join userprofile_combination on userprofile_alumni.combination_id=userprofile_combination.id where api_user.is_alumni and userprofile_family.id=%s;''',[request.query_params.dict()["family_id"]])
                    serializer = AlumniListsSerializer(user, many=True)
                    return Response(serializer.data)
                elif(list(request.query_params.keys())[0]=="combination_id"):
                    user = User.objects.raw('''select api_user.id,api_user.email, api_user.image_url, api_user.first_name, api_user.last_name, api_user.phone1, userprofile_grade.grade_name,userprofile_grade.id as grade_id,userprofile_family.family_name, userprofile_family.id as family_id,userprofile_combination.combination_name,userprofile_combination.id as combination_id from api_user left outer join userprofile_alumni on api_user.id=userprofile_alumni.user_id left outer join userprofile_family on userprofile_alumni.family_id=userprofile_family.id left outer join userprofile_grade on userprofile_family.grade_id=userprofile_grade.id left outer join userprofile_combination on userprofile_alumni.combination_id=userprofile_combination.id where api_user.is_alumni and userprofile_combination.id=%s;''',[request.query_params.dict()["combination_id"]])
                    serializer = AlumniListsSerializer(user, many=True)
                    return Response(serializer.data)
            else:
                user = User.objects.raw("select api_user.id,api_user.email, api_user.image_url, api_user.first_name, api_user.last_name, api_user.phone1, userprofile_grade.grade_name,userprofile_grade.id as grade_id,userprofile_family.family_name, userprofile_family.id as family_id,userprofile_combination.combination_name,userprofile_combination.id as combination_id from api_user left outer join userprofile_alumni on api_user.id=userprofile_alumni.user_id left outer join userprofile_family on userprofile_alumni.family_id=userprofile_family.id left outer join userprofile_grade on userprofile_family.grade_id=userprofile_grade.id left outer join userprofile_combination on userprofile_alumni.combination_id=userprofile_combination.id where api_user.is_alumni;")
                serializer = AlumniListsSerializer(user, many=True)
                return Response(serializer.data)
            
        except Exception as e:
            return Response(error=e,status=status.HTTP_404_NOT_FOUND)
   
class AluminiListByEyView(APIView):
    #permission_classes = [IsAuthenticated, ]
    
    def get(self,request):
        try:
            if request.query_params:
                if(list(request.query_params.keys())[0]=="ep_id"):
                    user = User.objects.raw('''select api_user.id,api_user.email, api_user.image_url, api_user.first_name, api_user.last_name, api_user.phone1, userprofile_grade.grade_name,userprofile_grade.id as grade_id,userprofile_family.family_name, userprofile_family.id as family_id,userprofile_combination.combination_name,userprofile_combination.id as combination_id,userprofile_ep.id as ep_id,userprofile_ep.title as ep_title from api_user left outer join userprofile_alumni on api_user.id=userprofile_alumni.user_id left outer join userprofile_family on userprofile_alumni.family_id=userprofile_family.id left outer join userprofile_grade on userprofile_family.grade_id=userprofile_grade.id left outer join userprofile_combination on userprofile_alumni.combination_id=userprofile_combination.id left outer join userprofile_alumni_eps on userprofile_alumni.id=userprofile_alumni_eps.alumni_id left outer join userprofile_ep on userprofile_ep.id=userprofile_alumni_eps.ep_id where api_user.is_alumni and userprofile_ep.id=%s;''',[request.query_params.dict()["ep_id"]])
                    serializer = AlumniListbyEPSerializer(user, many=True)
                    return Response(serializer.data)
                else:
                    return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class StaffUserView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = StaffUserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            if request.query_params:
                crc = User.objects.filter(**request.query_params.dict(), is_alumni=False)
            else:
                crc = User.objects.filter(is_alumni=False)

            # if there is something in items else raise error
            if crc:
                serializer = StaffUserSerializer(crc, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    user = User.objects.get(pk=pk)
    data = UpdateUserSerializer(instance=user, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        print(data.errors)
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_image(request, pk):
    user = User.objects.get(pk=pk)
    data = UpdateUserImageUrlSerializer(instance=user, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        print(data.errors)
        return Response(error=data.errors,status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_position(request, pk):
    user = CrcProfile.objects.get(user_id=pk)
    data = StaffRoleSerializer(instance=user, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        print(data.errors)
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    user.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_alumni_info(request):
    serializer = AlumniInfoRegSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    alumni_info = serializer.save()
    print(alumni_info.id)
    for ep_id in request.data.get('eps'):
        try:
            ep = Ep.objects.get(id=ep_id)
            alumni_info.eps.add(ep)
        except Ep.DoesNotExist:
            raise NotFound()

    return Response(data={"id":alumni_info.id},status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_alumni_info(request, pk=None):
    alumn = Alumni.objects.get(pk=pk)

    serializer = AlumniInfoUpdateSerializer(alumn, data=request.data)
    if serializer.is_valid():
        serializer.save()

        eps = []

        for ep_id in request.data.get('eps'):
            try:
                ep = Ep.objects.get(id=ep_id)
                eps.append(ep)
            except Ep.DoesNotExist:
                raise NotFound()

        alumn.eps.set(eps)

        return Response(data=serializer.data, status=status.HTTP_200_OK)
    else:
        print(serializer.errors)
        return Response(data=serializer.errors, status=status.HTTP_200_OK)


#login logout and change and reset password portal
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['is_superuser'] = user.is_superuser
        token['is_crc'] = user.is_crc
        token['is_alumni'] = user.is_alumni
        token['id'] = user.id
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'msg': 'Successfully Logged out'}, status=status.HTTP_200_OK)



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = PasswordChangeSerializer(context={'request': request}, data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PasswordReset(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = EmailSerilizer

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            encoded_pk = urlsafe_base64_encode(force_bytes(user.pk))
            token = PasswordResetTokenGenerator().make_token(user)

            reset_url = reverse(
                "reset-password",
                kwargs={"encoded_pk":encoded_pk, "token":token}
            )


            return Response(
                {
                    "message":reset_url
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"message":"User doesn't exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
class ResetPassword(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = ResetPasswordSerializer

    def patch(self, request, *args, **kwargs):

        serializer = self.serializer_class(
            data=request.data, context={"kwargs":kwargs}
        )
        serializer.is_valid(raise_exception=True)

        return Response(
            {"message":"Password reset complete"},
            status=status.HTTP_200_OK,
        )
    
    # End login logout and change password portal


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)


# families and grades views

class GradeView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = GradeSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            if request.query_params:
                grades = Grade.objects.filter(**request.query_params.dict()).order_by('start_academic_year')
            else:
                grades = Grade.objects.all()

            # if there is something in items else raise error
            if grades:
                serializer = GradeSerializers(grades, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_grade(request, pk):
    grade = Grade.objects.get(pk=pk)
    data = GradeSerializers(instance=grade, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_family(request, pk):
    family = Family.objects.get(pk=pk)
    data = FamilySerializer(instance=family, data=request.data)
    if data.is_valid():
        data.save()
        return Response(data.data, status=status.HTTP_201_CREATED)
    else:
        return Response(data.errors, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_grade(request, pk):
    grade = get_object_or_404(Grade, pk=pk)
    grade.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_family(request, pk):
    family = get_object_or_404(Family, pk=pk)
    family.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_families_to_grade(request):
    data = AddFamilySerializer(data=request.data)
    if data.is_valid():
        data.save()
        return Response(data.data, status=status.HTTP_201_CREATED)
    else:
        print(data.errors)
        return Response(data.errors, status=status.HTTP_404_NOT_FOUND)


# End


# Ep data means art,sport, sciences and clubs CRUD

class EpView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = EpSerializer(data=request.data)
        # validating for already existing data
        if Ep.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # checking for the parameters from the URL
            if request.query_params:
                ep = Ep.objects.filter(**request.query_params.dict())
            else:
                ep = Ep.objects.all()

            # if there is something in items else raise error
            if ep:
                serializer = EpSerializer(ep, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_Ep(request, pk):
    ep = Ep.objects.get(pk=pk)
    data = EpSerializer(instance=ep, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_ep(request, pk):
    ep = get_object_or_404(Ep, pk=pk)
    ep.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# Combination data view

class CombinationRegistrationView(APIView):
    #permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = CombinationSerializer(data=request.data)
        # validating for already existing data
        if Combination.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # checking for the parameters from the URL
            if request.query_params:
                comb = Combination.objects.filter(**request.query_params.dict())
            else:
                comb = Combination.objects.all()

            # if there is something in items else raise error
            if comb:
                serializer = CombinationSerializer(comb, many=True)
                return Response(serializer.data)
            else:
                return Response([])
            
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_Comb(request, pk):
    comb = Combination.objects.get(pk=pk)
    data = CombinationSerializer(instance=comb, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comb(request, pk):
    comb = get_object_or_404(Combination, pk=pk)
    comb.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# end

# Event data view

class EventView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = EventSerializer(data=request.data)
        # validating for already existing data
        if Event.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # checking for the parameters from the URL
            if request.query_params:
                eve = Event.objects.filter(**request.query_params.dict())
            else:
                eve = Event.objects.all()

            # if there is something in items else raise error
            if eve:
                serializer = EventSerializer(eve, many=True)
                return Response(serializer.data)
            else:
                return Response([])
            
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST']) 
def create_Event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_Event(request, pk):
    eve = Event.objects.get(pk=pk)
    data = UpdateEventSerializer(instance=eve, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_eve(request, pk):
    eve = get_object_or_404(Event, pk=pk)
    eve.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# end


# Story data view
class StoryView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = StorySerializer(data=request.data)
        # validating for already existing data
        if Story.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # checking for the parameters from the URL
            if request.query_params:
                onestory = Story.objects.filter(**request.query_params.dict())
                serializer = StoryWithAlumnSerializer(onestory, many=True)
                return Response(serializer.data)
            else:
                story = User.objects.raw(
                    "SELECT api_user.id as id, api_user.email as email, api_user.phone1 as phone1, api_user.first_name as first_name, api_user.last_name as last_name,api_user.image_url,userprofile_Story.description as description,userprofile_Story.displayed as displayed,userprofile_Story.id as story_id  FROM api_user LEFT JOIN userprofile_alumni ON api_user.id=userprofile_alumni.user_id LEFT JOIN userprofile_Story ON userprofile_alumni.id=userprofile_Story.alumn_id WHERE api_user.is_alumni=true;")

            # if there is something in items else raise error
            if story:
                serializer = DisplayAllStoriesSerializer(story, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


class StoryHomeView(APIView):
    def get(self, request):
        try:
            # checking for the parameters from the URL
            story = User.objects.raw(
                    "SELECT api_user.id as id, api_user.email as email, api_user.phone1 as phone1, api_user.first_name as first_name, api_user.last_name as last_name,api_user.image_url,userprofile_Story.description as description,userprofile_Story.displayed as displayed,userprofile_Story.id as story_id  FROM api_user LEFT JOIN userprofile_alumni ON api_user.id=userprofile_alumni.user_id LEFT JOIN userprofile_Story ON userprofile_alumni.id=userprofile_Story.alumn_id WHERE api_user.is_alumni=true and userprofile_Story.displayed=true;")
            # if there is something in items else raise error
            if story:
                serializer = DisplayAllStoriesSerializer(story, many=True)
                return Response(serializer.data)
            else:
                return Response([])
            
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
# update story is meant for updating the content of the story

def update_story(request, pk):
    story = Story.objects.get(pk=pk)
    data = UpdateStorySerializer(instance=story, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
# display story is meant for displaying the story in the front page

def display_story(request, pk):
    try:
        story = Story.objects.get(pk=pk)
        data = DisplayStorySerializer(instance=story, data=request.data)

        if data.is_valid():
            data.save()
            return Response(data.data)
        else:
                return Response([])
    
    except Exception as e:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_story(request, pk):
    story = get_object_or_404(Story, pk=pk)
    story.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# end

# Employment view
class EmploymentView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        serializer = EmploymentSerializer(data=request.data)
        # validating for already existing data
        if Employment.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            if request.query_params:
                alumn = Employment.objects.filter(**request.query_params.dict())
                serializer = EmploymentDisplayOneSerializer(alumn, many=True)
                return Response(serializer.data)
            else:
                user = User.objects.raw("SELECT api_user.id as id,userprofile_alumni.id as alumn_id, api_user.email as email, api_user.phone1 as phone1, api_user.first_name as first_name, api_user.last_name as last_name,api_user.image_url,userprofile_employment.title as title,userprofile_employment.company as company,userprofile_employment.description,userprofile_employment.start_date,userprofile_employment.end_date as end,userprofile_employment.status as status,userprofile_employment.id as emp_id,userprofile_employment.career as career,userprofile_family.family_name,userprofile_grade.grade_name,userprofile_combination.combination_name  FROM api_user LEFT JOIN userprofile_alumni ON api_user.id=userprofile_alumni.user_id LEFT JOIN userprofile_family on userprofile_alumni.family_id=userprofile_family.id LEFT JOIN userprofile_grade on userprofile_family.grade_id=userprofile_grade.id LEFT JOIN userprofile_combination on userprofile_alumni.combination_id=userprofile_combination.id  LEFT JOIN userprofile_employment ON userprofile_alumni.id=userprofile_employment.alumn_id WHERE api_user.is_alumni=true;")
        
            # if there is something in items else raise error
            if user:
                serializer = DisplayEmploymentSerializer(user, many=True)
                return Response(serializer.data)
            else:
                return Response([])

        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
class GradesAndFamiliesView(APIView):
    permission_classes = [IsAuthenticated, ]  
    def get(self,request):
        try:
            user = User.objects.raw("select userprofile_family.id,userprofile_family.family_name,userprofile_grade.grade_name,userprofile_grade.start_academic_year, userprofile_grade.end_academic_year from userprofile_grade inner join userprofile_family on userprofile_grade.id=userprofile_family.grade_id order by userprofile_grade.start_academic_year;")
    
            # if there is something in items else raise error
            if user:
                serializer = GradesAndFamiliesSerializer(user, many=True)
                return Response(serializer.data)
            else:
                return Response([])
            
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_Employment(request, pk):
    employment = Employment.objects.get(pk=pk)
    data = EmploymentUpdateSerializer(instance=employment, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_employment(request, pk):
    employment = get_object_or_404(Employment, pk=pk)
    employment.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# Studie data view

class StudieView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = StudieSerializer(data=request.data)
        # validating for already existing data
        if Studie.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # checking for the parameters from the URL
            if request.query_params:
                stud1 = Studie.objects.filter(**request.query_params.dict())
                serializer = StudyWithAlumnSerializer(stud1, many=True)
                return Response(serializer.data)
            else:
                stud = User.objects.raw("SELECT api_user.id as id, api_user.email as email, api_user.phone1 as phone1, api_user.first_name as first_name, api_user.last_name as last_name,api_user.image_url,userprofile_alumni.id as alumn_id,userprofile_studie.level,userprofile_studie.degree,userprofile_studie.university,userprofile_studie.country,userprofile_studie.scholarship,userprofile_studie.status,userprofile_studie.id as study_id,userprofile_studie.scholarship_details  FROM api_user LEFT JOIN userprofile_alumni ON api_user.id=userprofile_alumni.user_id LEFT JOIN userprofile_studie ON userprofile_alumni.id=userprofile_studie.alumn_id WHERE api_user.is_alumni=true;")
        
            # if there is something in items else raise error
            if stud:
                serializer = StudieWithAlumnSerializer(stud, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_studie(request, pk):
    stud = Studie.objects.get(pk=pk)
    data = UpdateStudieSerializer(instance=stud, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_studie(request, pk):
    stud = get_object_or_404(Studie, pk=pk)
    stud.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# end


# Opportunity model
@api_view(['GET'])  # GET request, return all opportunities
def read_opportunity(request):
    opportunities = Opportunity.objects.all()
    serializer = OpportunitySerializer(opportunities, many=True)
    return Response(serializer.data)


@api_view(['POST'])  # POST request, create opportunity object
def create_opportunity(request):
    request.data['approved'] = False  # default approved is False
    serializer = OpportunitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# Dashboard needed data view


class StudyReportView(APIView):
    permission_classes = [IsAuthenticated, ]  
    def get(self,request):
        try:
            stud = Studie.objects.raw("select 1 as id, count(userprofile_studie.level) as level, userprofile_studie.level as degree from userprofile_studie group by userprofile_studie.level;")
    
            # if there is something in items else raise error
            if stud:
                serializer = StudyReportSerializer(stud, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


# Gallery data view

@api_view(['GET'])  
def read_gallery(request):
    try:
        galleries = Gallery.objects.all()
        serializer = GallerySerializer(galleries, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_gallery(request):
    serializer = GallerySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_gallery(request, pk):
    gall = Gallery.objects.get(pk=pk)
    data = UpdateGallerySerializer(instance=gall, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_gallery(request, pk):
    stud = get_object_or_404(Gallery, pk=pk)
    stud.delete()
    return Response(status=status.HTTP_202_ACCEPTED)


# end


# Opportunity model
@api_view(['GET'])
def read_opportunity(request):
    try:
        opportunities = Opportunity.objects.all()
        serializer = OpportunitySerializer(opportunities, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(e)


@api_view(['POST'])
def create_opportunity(request):
    serializer = OpportunitySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class DeleteOpportunityView(APIView):
    def delete(self, request, pk):
        try:
            opportunity = Opportunity.objects.get(pk=pk)
        except Opportunity.DoesNotExist:
            return Response({'msg': 'Opportunity not found'}, status=status.HTTP_404_NOT_FOUND)

        opportunity.delete()
        return Response({'msg': 'Opportunity deleted successfully'}, status=status.HTTP_200_OK)


class UpdateOpportunityView(RetrieveUpdateAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = UpdateOpportunitySerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # check is user is alumni
        if request.user.is_authenticated and request.user.is_alumni:
            raise PermissionDenied("Opportunity has been approved so cannot modify.")

        # update
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class ApproveOpportunityView(RetrieveUpdateAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = ApproveOpportunitySerializer
    lookup_field = 'pk'


# Dashboard needed data view

class AlumnReportView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            stud = User.objects.raw(
            "SELECT api_user.id,userprofile_alumni.gender,userprofile_grade.grade_name,userprofile_family.family_name,userprofile_combination.combination_name,userprofile_employment.status as employed,userprofile_employment.end_date as end,userprofile_studie.level as degree from api_user left outer join userprofile_alumni on api_user.id=userprofile_alumni.user_id LEFT OUTER JOIN userprofile_family ON userprofile_alumni.family_id=userprofile_family.id left outer join userprofile_grade on userprofile_family.grade_id=userprofile_grade.id LEFT OUTER JOIN userprofile_employment ON userprofile_alumni.id=userprofile_employment.alumn_id LEFT OUTER JOIN userprofile_studie ON userprofile_alumni.id=userprofile_studie.alumn_id left outer join userprofile_combination on userprofile_alumni.combination_id=userprofile_combination.id  WHERE api_user.is_alumni;")

            # if there is something in items else raise error
            if stud:
                serializer = TotalAlumnReportSerializer(stud, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(error=e,status=status.HTTP_404_NOT_FOUND)

class AlumnInGradeReportView(APIView):
    permission_classes = [IsAuthenticated, ]  
    def get(self,request):
        try:
            stud = User.objects.raw("SELECT userprofile_grade.id,  userprofile_grade.grade_name as grade,userprofile_alumni.gender,count(*) as number from api_user left outer join userprofile_alumni on api_user.id=userprofile_alumni.user_id LEFT OUTER JOIN userprofile_family ON userprofile_alumni.Family_id=userprofile_family.id LEFT OUTER JOIN userprofile_grade ON userprofile_family.grade_id=userprofile_grade.id WHERE api_user.is_alumni group by userprofile_grade.id, userprofile_alumni.gender;")
        
            # if there is something in items else raise error
            if stud:
                serializer = TotalAlumnGradeSerializer(stud, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

class EmploymentStudieReportView(APIView):
    permission_classes = [IsAuthenticated, ]  
    def get(self,request):
        try: 
            empstud = User.objects.raw("SELECT alumni.gender,grade.grade_name,employment.status as emp,studie.level as stu,alumni.id FROM userprofile_alumni AS alumni LEFT JOIN userprofile_employment AS employment ON employment.alumn_id = alumni.id LEFT JOIN userprofile_studie AS studie ON studie.alumn_id=alumni.id JOIN userprofile_family AS family ON alumni.family_id= family.id JOIN userprofile_grade AS grade ON family.grade_id=grade.id;")
            
            # if there is something in items else raise error
            if empstud:
                serializer = EmploymentAndStudieSerializer(empstud, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response( status=status.HTTP_404_NOT_FOUND)
        


# Gallery data view

class GalleryView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = GallerySerializer(data=request.data)
        # validating for already existing data
        if Gallery.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # checking for the parameters from the URL
            if request.query_params:
                gall = Gallery.objects.filter(**request.query_params.dict())
            else:
                gall = Gallery.objects.all()

            # if there is something in items else raise error
            if gall:
                serializer = GallerySerializer(gall, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def create_gallery(request):
    serializer = GallerySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_gallery(request, pk):
    gall = Gallery.objects.get(pk=pk)
    data = GallerySerializer(instance=gall, data=request.data)

    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_gallery(request, pk):
    stud = get_object_or_404(Gallery, pk=pk)
    stud.delete()
    return Response(status=status.HTTP_202_ACCEPTED)
# end


# News
@api_view(['POST'])
def create_news(request):
    serializer = NewsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


class newsView(APIView):
    #permission_classes = [IsAuthenticated, ]
    
    def get(self, request):
        try:
            # checking for the parameters from the URL
            if request.query_params:
                news = News.objects.filter(**request.query_params.dict())
            else:
                news = News.objects.all()

            # if there is something in items else raise error
            if news:
                serializer = NewsSerializer(news, many=True)
                return Response(serializer.data)
            else:
                return Response([])
        except Exception as e:
            return Response(status=status.HTTP_404_NOT_FOUND)

""" @api_view(['GET'])
def news_list(request):
    news = News.objects.all()
    serializer = NewsSerializer(news, many=True)
    return Response(serializer.data) """


@api_view(['PUT'])
def update_news(request, pk):
    try:
        news = News.objects.get(pk=pk)
    except News.DoesNotExist:
        return Response(status=404)

    if request.data.get('pinned', False):  # if the news is to be pinned
        pinned_news_count = News.objects.filter(pinned=True).count()
        if pinned_news_count > 4:  # if there are already 4 pinned news
            return Response({'error': 'Cannot pin more than 4 news.'}, status=400)  # reject the request

    serializer = NewsSerializer(news, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_news(request, pk):
    try:
        news = News.objects.get(pk=pk)
    except News.DoesNotExist:
        return Response(status=404)

    news.delete()
    return Response(status=204)


# Count alumni to show in front page
def alumni_count(request):
    try:
        count = Alumni.objects.count()  # count Alumni number
        return JsonResponse({"count": count})  # response JSON
    except Exception as e:
        return Response(e)

class UserCountAPIView(APIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, request, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("""
            select COUNT(api_user.id) as total_users,
            COUNT(CASE WHEN userprofile_alumni.gender = 'Male' THEN 1 END) AS male_count,
            COUNT(CASE WHEN userprofile_alumni.gender = 'Female' THEN 1 END) AS female_count 
            from api_user left join userprofile_alumni on api_user.id=userprofile_alumni.user_id 
            where api_user.is_alumni;
            """)
            row = cursor.fetchone()
            
            #for education
        sql_query1 = "select alumn_id,level, CASE WHEN level = 'PHD' THEN 1 WHEN level = 'M' THEN 2 WHEN level= 'A0' THEN 3 WHEN level = 'A1' THEN 4 WHEN level = 'C' THEN 5 WHEN level = 'NMS' THEN 6 WHEN level= 'D' THEN 0 ELSE 7 END AS level_code from userprofile_studie order by alumn_id,level_code desc;"

        # Execute the SQL query
        with connection.cursor() as cursor1:
            cursor1.execute(sql_query1)
            columns = [col[0] for col in cursor1.description]
            data1 = cursor1.fetchall()

        # Create a Pandas DataFrame
        df = pd.DataFrame(data1, columns=columns)
        # Count alumn_id group by level, and for repeated alumn_id, count the one with less level_code
        result_df = df.groupby('alumn_id').apply(lambda group: group.loc[group['level_code'].idxmin()]).groupby('level').agg({'alumn_id': 'count'}).reset_index()
        
        # Rename columns as needed
        result_df.columns = ['level', 'count']
        result_dict = dict(zip(result_df['level'], result_df['count']))
        
        #for employment
        sql_query2 = "select alumn_id,status, CASE WHEN status = 'S' THEN 1 WHEN status = 'F' THEN 2 WHEN status= 'P' THEN 3 WHEN status = 'I' THEN 4 WHEN status = 'U' THEN 5 WHEN status= 'D' THEN 0 ELSE 6 END AS status_code from userprofile_employment order by alumn_id,status_code desc;"

        # Execute the SQL query
        with connection.cursor() as cursor2:
            cursor2.execute(sql_query2)
            columns2 = [col[0] for col in cursor2.description]
            data2 = cursor2.fetchall()

        # Create a Pandas DataFrame
        df2 = pd.DataFrame(data2, columns=columns2)
        
        # Count alumn_id group by status, and for repeated alumn_id, count the one with less status_code
        result_df2 = df2.groupby('alumn_id').apply(lambda group: group.loc[group['status_code'].idxmin()]).groupby('status').agg({'alumn_id': 'count'}).reset_index()
        
        # Rename columns as needed
        result_df2.columns = ['status', 'count']
        
        result_dict2 = dict(zip(result_df2['status'], result_df2['count']))
        
        # Check if the old key exists in the dictionary
        if 'D' in result_dict2:
            # Create a new key with the desired name and assign the value of the old key
            result_dict2['DEM'] = result_dict2.pop('D')
            
        # Check if the old key exists in the dictionary
        if 'N' in result_dict2:
            # Create a new key with the desired name and assign the value of the old key
            result_dict2['NEM'] = result_dict2.pop('N')
        
        
        if row is not None:
            data = {
                'total_users': row[0],
                'male_count': row[1],
                'female_count': row[2]
            }
            data.update(result_dict)
            
            keys=['C','A1','A0','M','PHD','NMS','D','N']
            difference_list = list(set(keys) - set(list(result_dict.keys())))
            
            if(len(difference_list)>0):
                data.update({key: 0 for key in difference_list})
                
            data.update(result_dict2)
            keys2=['S','F','P','I','U','DEM','NEM']
            difference_list2 = list(set(keys2) - set(list(result_dict2.keys())))
            
            if(len(difference_list2)>0):
                data.update({key: 0 for key in difference_list2})

            serializer = AlumniCountSerializer(data)
            return Response(serializer.data)
        else:
            # Handle the case when no rows are returned
            data = {
                'total_users': 0,
                'male_count': 0,
                'female_count': 0,
                'C':0,
                'A1':0,
                'A0':0,
                'M':0,
                'PHD':0,
                'NMS':0,
                'D':0,
                'N':0,
                'F':0,
                'P':0,
                'S':0,
                'I':0,
                'U':0,
                'DEM':0,
                'NEM':0
            }

            serializer = AlumniCountSerializer(data)
            return Response(serializer.data)
        
class UserCountByGradeAPIView(APIView):
    #permission_classes = [IsAuthenticated, ]
    def get(self, request, *args, **kwargs):
        
            
            #count alumni by grade
        sql_query1 = "select userprofile_grade.grade_name,userprofile_grade.end_academic_year, sum(CASE WHEN userprofile_alumni.gender = 'Male' THEN 1 ELSE 0 END) AS male,sum(CASE WHEN userprofile_alumni.gender='Female' THEN 1 ELSE 0 END) AS female from userprofile_alumni inner join userprofile_family on userprofile_alumni.family_id=userprofile_family.id inner join userprofile_grade on userprofile_family.grade_id=userprofile_grade.id group by userprofile_grade.grade_name,userprofile_grade.end_academic_year  order by userprofile_grade.end_academic_year;"

        # Execute the SQL query
        with connection.cursor() as cursor1:
            cursor1.execute(sql_query1)
            #columns = [col[0] for col in cursor1.description]
            data1 = cursor1.fetchall()
            
            # Create a Pandas DataFrame
       # df = pd.DataFrame(data1, columns=columns)
        data=[]   
        if data1 is not None:
            for i in data1:
                data.append({
                        'grade_name': i[0],
                        'male': i[2],
                        'female': i[3]
                })

        serializer = AlumniCountByGradeSerializer(data, many=True)
        return Response(serializer.data)
        

        

