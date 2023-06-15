from django.urls import path
from . import views


from rest_framework_simplejwt.views import (
    TokenRefreshView, 
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('staff/', views.StaffUserView.as_view(), name='auth_registercrc'),
    path('alumni/', views.AluminiRegistrationView.as_view(), name='auth_registeralumini'),
    path('registera/info/', views.create_alumni_info, name='auth_registeraluminiinfo'),
    path('deleteuser/<str:pk>/delete/', views.delete_user, name='delete-user'),
    path('updateuser/<str:pk>', views.update_user, name='update-user'),
    path('updateuserimage/<str:pk>', views.update_user_image, name='update-userimage'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('grades/', views.GradeView.as_view(),name="grades"),
    path('grade/<int:pk>/', views.update_grade),
    path('grade/<int:pk>/delete/', views.delete_grade),
    path('family/<int:pk>/delete/', views.delete_family),
    path('family/<int:pk>/', views.update_family),
    path('addfamilies/', views.add_families_to_grade),
    path('combination/',views.CombinationRegistrationView.as_view()),
    path('combination/<int:pk>/delete/', views.delete_comb, name='delete-comb'),
    path('combination/<int:pk>/', views.update_Comb, name='update_comb'),
    path('ep/',views.EpView.as_view()),
    path('ep/<int:pk>/delete/', views.delete_ep, name='delete-items'),
    path('updateep/<int:pk>/', views.update_Ep, name='update-eps'),
    path('employment/',views.EmploymentView.as_view()),
    path('employment/<int:pk>/delete/', views.delete_employment, name='delete-items'),
    path('updateemployment/<int:pk>/', views.update_Employment, name='update-employment'),
    path('updateposition/<str:pk>', views.update_user_position, name='update-user-position'),
    path('event/', views.EventView.as_view()),
    path('updateevent/<int:pk>/', views.update_Event, name='update-events'),
    path('event/', views.EventView.as_view()),
    path('updateevent/<int:pk>/', views.update_Event, name='update-events'),
    path('', views.getRoutes)
]