from django.urls import path
from . import views


from rest_framework_simplejwt.views import (
    TokenRefreshView, 
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registercrc/', views.CrcRegistrationView.as_view(), name='auth_registercrc'),
    path('registeradmin/', views.AdminRegistrationView.as_view(), name='auth_registeradmin'),
    path('deleteuser/<str:pk>/delete/', views.delete_user, name='delete-user'),
    path('updateuser/<str:pk>', views.update_user, name='update-user'),
    path('updateuserimage/<str:pk>', views.update_user_image, name='update-userimage'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('', views.getRoutes)
]