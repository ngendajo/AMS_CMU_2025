from django.contrib.auth import logout
from django.db.models import Count
from django.db.models import F
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from rest_framework import status
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import  Response
from rest_framework.views import APIView 
from .serializer import UpdateUserEmailSerializer,AdminSerializer,AdminRegistrationSerializer, CrcRegistrationSerializer,CrcListSerializer,PasswordChangeSerializer,CrcListSerializer1
from userprofile.models import CrcProfile
from .models import User
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()
# Create your views here.

#CRC data

class AdminRegistrationView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        print(request.data)
        serializer = AdminRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        if request.query_params:
            user=User.objects.filter(**request.query_params.dict(),is_alumni=False)
        else:
            user = User.objects.filter(is_alumni=False)
    
        # if there is something in items else raise error
        if user:
            serializer = AdminSerializer(user, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CrcRegistrationView(APIView):
    permission_classes = [IsAuthenticated, ]
    def post(self, request):
        serializer = CrcRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        if request.query_params:
            crc=CrcProfile.objects.filter(**request.query_params.dict())
        else:
            crc = CrcProfile.objects.all()
    
        # if there is something in items else raise error
        if crc:
            serializer = CrcListSerializer(crc, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

class GetCrcView(APIView):
    permission_classes = [IsAuthenticated, ]
    
    def get(self,request,pk):
        crc= User.objects.filter(email=pk)
        print(pk)
        if crc:
            serializer = CrcListSerializer1(crc, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)       

        
@api_view(['POST'])
#@permission_classes([IsAuthenticated])
def update_user_email(request, pk):
    user = User.objects.get(pk=pk)
    data = UpdateUserEmailSerializer(instance=user, data=request.data)
 
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