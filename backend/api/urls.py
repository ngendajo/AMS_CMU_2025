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
    
    path('alumni/info/', views.create_alumni_info, name='auth_registeraluminiinfo'),
    path('alumni/info/<int:pk>/update/', views.update_alumni_info, name='alumn-info-update'),
    
    
    path('deleteuser/<str:pk>/delete/', views.delete_user, name='delete-user'),
    path('updateuser/<str:pk>', views.update_user, name='update-user'),
    path('updateuserimage/<str:pk>', views.update_user_image, name='update-userimage'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    #grade paths
    path('grades/', views.GradeView.as_view(),name="grades"),
    path('grade/<int:pk>/', views.update_grade),
    path('grade/<int:pk>/delete/', views.delete_grade),
    #family paths
    path('family/<int:pk>/delete/', views.delete_family),
    path('family/<int:pk>/', views.update_family),
    path('addfamilies/', views.add_families_to_grade),
    #combination paths
    path('combination/',views.CombinationRegistrationView.as_view()),
    path('combination/<int:pk>/delete/', views.delete_comb, name='delete-comb'),
    path('combination/<int:pk>/', views.update_Comb, name='update_comb'),
    #ep paths
    path('ep/',views.EpView.as_view()),
    path('ep/<int:pk>/delete/', views.delete_ep, name='delete-items'),
    path('updateep/<int:pk>/', views.update_Ep, name='update-eps'),
    #employment paths
    path('employment/',views.EmploymentView.as_view()),
    path('employment/<int:pk>/delete/', views.delete_employment, name='delete-items'),
    path('updateemployment/<int:pk>/', views.update_Employment, name='update-employment'),
    path('updateposition/<str:pk>', views.update_user_position, name='update-user-position'),
    #event paths
    path('event/', views.EventView.as_view()),
    path('updateevent/<int:pk>/', views.update_Event, name='update-events'),
    path('deleteevent/<int:pk>/', views.delete_eve, name='delete-events'),
    #story paths
    path('story/', views.StoryView.as_view()),
    path('updatestory/<int:pk>/', views.update_story, name='update-stories'),
    path('deletestory/<int:pk>/delete/', views.delete_story, name='delete-stories'),
    path('displaystory/<int:pk>/', views.display_story, name='display-story'),
    #studie paths
    path('studie/', views.StudieView.as_view()),
    path('updatestudie/<int:pk>/', views.update_studie, name='update-studie'),
    path('deletestudie/<int:pk>/delete/', views.delete_studie, name='delete-studie'),

    #Dashdboard data
    path('alumnreport/', views.AlumnReportView.as_view()),
    path('studyreport/', views.StudyReportView.as_view()),
    path('employmentreport/', views.EmploymentReportView.as_view()),
    path('', views.getRoutes)
    path('deletestudie/<int:pk>/', views.delete_studie, name='delete-studie'),
    path('', views.getRoutes),
    #gallery paths
    path('gallery/', views.GalleryView.as_view()),
    path('gallery/create/', views.create_gallery, name='create-gallery'),
    path('updategallery/<int:pk>/', views.update_gallery, name='update-gallery'),
    path('deletegallery/<int:pk>/', views.delete_gallery, name='delete-gallery'),
]