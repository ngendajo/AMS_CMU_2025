from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView, 
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registercrc/', views.CrcRegistrationView.as_view(), name='auth_registercrc'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('', views.getRoutes)
]