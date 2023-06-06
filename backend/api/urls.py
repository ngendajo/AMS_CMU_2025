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
    path('registera/', views.AluminiRegistrationView.as_view(), name='auth_registeralumini'),
    path('registerstaff/', views.StaffRegistrationView.as_view(), name='auth_registerstaff'),
    path('deleteuser/<str:pk>/delete/', views.delete_user, name='delete-user'),
    path('updateuser/<str:pk>', views.update_user, name='update-user'),
    path('updateuserimage/<str:pk>', views.update_user_image, name='update-userimage'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('grades/', views.GradeRegistrationView.as_view(),name="grades"),
    path('grade/<int:pk>/', views.update_grade),
    path('grade/<int:pk>/delete/', views.delete_grade),
    path('family/<int:pk>/', views.update_family),
    path('combination/',views.CombinationRegistrationView.as_view()),
    path('combination/<int:pk>/delete/', views.delete_comb, name='delete-comb'),
    path('combination/<int:pk>/', views.update_Comb, name='update_comb'),
    path('ep/',views.EpRegistrationView.as_view()),
    path('updateposition/<str:pk>', views.update_user_position, name='update-user-position'),
    path('ep/<int:pk>/delete/', views.delete_ep, name='delete-items'),
    path('updateep/<int:pk>/', views.update_Ep, name='update-eps'),
    path('', views.getRoutes)
]