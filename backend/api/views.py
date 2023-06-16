from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import  Response
from rest_framework import serializers
from rest_framework.views import APIView 
from .serializer import *
from userprofile.models import *
from .models import User
from django.contrib.auth import get_user_model
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()
# Create your views here.

#User data

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
    
    def get(self,request):
        if request.query_params:
            user=User.objects.filter(**request.query_params.dict(),is_alumni=True)
        else:
            user = User.objects.filter(is_alumni=True)
    
        # if there is something in items else raise error
        if user:
            serializer = AlumniSerializer(user, many=True)
            return Response(serializer.data)
        else:
            return Response(serializer.errors,status=status.HTTP_404_NOT_FOUND)
        
        

class StaffUserView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = StaffUserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        if request.query_params:
            crc=User.objects.filter(**request.query_params.dict(),is_alumni=False)
        else:
            crc = User.objects.filter(is_alumni=False)
    
        # if there is something in items else raise error
        if crc:
            serializer = StaffUserSerializer(crc, many=True)
            return Response(serializer.data)
        else:
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
        return Response(status=status.HTTP_404_NOT_FOUND)
    
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
    for ep_id in request.data.get('Eps'):
        try:
            ep = Ep.objects.get(id=ep_id)
            alumni_info.Eps.add(ep)
        except Ep.DoesNotExist:
            raise NotFound()

    return Response( status=status.HTTP_201_CREATED)
        
#End CRC data 

#login logout and change password portal
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user) 

        # Add custom claims
        token['first_name']=user.first_name
        token['last_name']=user.last_name
        token['email']=user.email
        token['is_superuser']=user.is_superuser
        token['is_crc']=user.is_crc
        token['is_alumni']=user.is_alumni
        token['id']=user.id
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
    
    # End login logout and change password portal

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)


#families and grades views

class GradeView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = GradeSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    def get(self,request):
        if request.query_params:
            grades = Grade.objects.filter(**request.query_params.dict())
        else:
            grades = Grade.objects.all()
    
        # if there is something in items else raise error
        if grades:
            serializer = GradeSerializers(grades, many=True)
            return Response(serializer.data)
        else:
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
        return Response(data.errors,status=status.HTTP_404_NOT_FOUND)
    
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
        return Response(data.errors,status=status.HTTP_404_NOT_FOUND)
#End
        
    

#Ep data means art,sport, sciences and clubs CRUD
    
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
         
    def get(self,request):
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
    permission_classes = [IsAuthenticated, ]
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
        
    def get(self,request):
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
#end

# Event data view

class EventView(APIView):
    #permission_classes = [IsAuthenticated, ]
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
        
    def get(self,request):
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
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def update_Event(request, pk):
    eve = Event.objects.get(pk=pk)
    data = UpdateEventSerializer(instance=eve, data=request.data)
 
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
#@permission_classes([IsAuthenticated])
def delete_eve(request, pk):
    eve = get_object_or_404(Event, pk=pk)
    eve.delete()
    return Response(status=status.HTTP_202_ACCEPTED)
#end


# Story data view
class StoryView(APIView):
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
        
    def get(self,request):
         # checking for the parameters from the URL
        if request.query_params:
            story = Story.objects.filter(**request.query_params.dict())
        else:
            story = Story.objects.all()
    
        # if there is something in items else raise error
        if story:
            serializer = StorySerializer(story, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])

#update story is meant for updating the content of the story

def update_story(request, pk):
    story = Story.objects.get(pk=pk)
    data = UpdateStorySerializer(instance=story, data=request.data)
 
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])

#display story is meant for displaying the story in the front page

def display_story(request, pk):
    story = Story.objects.get(pk=pk)
    data = DisplayStorySerializer(instance=story, data=request.data)
 
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['DELETE'])
#@permission_classes([IsAuthenticated])
def delete_story(request, pk):
    story = get_object_or_404(Story, pk=pk)
    story.delete()
    return Response(status=status.HTTP_202_ACCEPTED)
#end

#Employment view
class EmploymentView(APIView):
    #permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = EmploymentSerializer(data=request.data)
        # validating for already existing data
        if Employment.objects.filter(**request.data).exists():
            raise serializers.ValidationError('This data already exists')
    
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
         
    def get(self,request):
         # checking for the parameters from the URL
        if request.query_params:
            employment = Employment.objects.filter(**request.query_params.dict())
        else:
            employment = Employment.objects.all()
    
        # if there is something in items else raise error
        if employment:
            serializer = EmploymentSerializer(employment, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_Employment(request, pk):
    employment = Employment.objects.get(pk=pk)
    data = EmploymentSerializer(instance=employment, data=request.data)
 
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
    #permission_classes = [IsAuthenticated, ]
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
        
    def get(self,request):
         # checking for the parameters from the URL
        if request.query_params:
            stud = Studie.objects.filter(**request.query_params.dict())
        else:
            stud = Studie.objects.all()
    
        # if there is something in items else raise error
        if stud:
            serializer = StudieSerializer(stud, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def update_studie(request, pk):
    stud = Studie.objects.get(pk=pk)
    data = UpdateStudieSerializer(instance=stud, data=request.data)
 
    if data.is_valid():
        data.save()
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
#@permission_classes([IsAuthenticated])
def delete_studie(request, pk):
    stud = get_object_or_404(Studie, pk=pk)
    stud.delete()
    return Response(status=status.HTTP_202_ACCEPTED)
#end
