from django.urls import path
from . import views


from rest_framework_simplejwt.views import (
    TokenRefreshView, 
)

from .views import alumni_count

urlpatterns = [
    # user paths
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('changepassword/',views.ChangePasswordView.as_view(),name="change_password"),
    path('password-reset/<str:encoded_pk>/<str:token>',
        views.ResetPassword.as_view(),
         name="reset-password",
    ), 
    path('password-reset/', views.PasswordReset.as_view(), name="password-reset"),
    path('users/', views.get_users, name="users"),
    path('staff/', views.StaffUserView.as_view(), name='auth_registercrc'),
    path('alumni/', views.AluminiRegistrationView.as_view(), name='auth_registeralumini'),
    path('alumnilist/', views.AluminiListView.as_view(), name='alumini'),
    path('alumnilistbyep/', views.AluminiListByEyView.as_view(), name='aluminiep'),
    path('bulkalumni/', views.AluminiBulkRegistrationView.as_view(), name='auth_bulkregisteralumini'),
    path('alumnitotal/', views.UserCountAPIView.as_view(), name='alumni_by_gender'),
    path('alumnitotalbygrade/', views.UserCountByGradeAPIView.as_view(), name='alumni_by_grade'),
    path('emplbygrade/', views.EmploymentStatusByGradeAPIView.as_view(), name='empl_by_grade'),
    path('stubygrade/', views.StudieStatusByGradeAPIView.as_view(), name='stu_by_grade'),
    path('empstubygrade/', views.StudieEmployStatusByGradeAPIView.as_view(), name='empstu_by_grade'),
    
    path('alumni/info/', views.create_alumni_info, name='auth_registeraluminiinfo'),
    path('alumni/info/<int:pk>/update/', views.update_alumni_info, name='alumn-info-update'),
    
    
    path('deleteuser/<str:pk>/delete/', views.delete_user, name='delete-user'),
    path('updateuser/<str:pk>', views.update_user, name='update-user'),
    path('updateuserimage/<str:pk>', views.update_user_image, name='update-userimage'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # grade paths
    path('grades/', views.GradeView.as_view(),name="grades"),
    path('grade/<int:pk>/', views.update_grade),
    path('grade/<int:pk>/delete/', views.delete_grade),

    # family paths
    path('family/<int:pk>/delete/', views.delete_family),
    path('family/<int:pk>/', views.update_family),
    path('addfamilies/', views.add_families_to_grade),
    path('families/', views.GradesAndFamiliesView.as_view()),
    #combination paths
    path('combination/',views.CombinationRegistrationView.as_view()),
    path('combination/<int:pk>/delete/', views.delete_comb, name='delete-comb'),
    path('combination/<int:pk>/', views.update_Comb, name='update_comb'),

    # ep paths
    path('ep/',views.EpView.as_view()),
    path('ep/<int:pk>/delete/', views.delete_ep, name='delete-items'),
    path('updateep/<int:pk>/', views.update_Ep, name='update-eps'),

    # employment paths
    path('employment/',views.EmploymentView.as_view()),
    path('employment/<int:pk>/delete/', views.delete_employment, name='delete-items'),
    path('updateemployment/<int:pk>/', views.update_Employment, name='update-employment'),
    path('updateposition/<str:pk>', views.update_user_position, name='update-user-position'),

    # event paths
    path('event/', views.EventView.as_view()),
    path('event/create/', views.create_Event, name='create-event'),
    path('updateevent/<int:pk>/', views.update_Event, name='update-events'),
    path('deleteevent/<int:pk>/', views.delete_eve, name='delete-events'),

    # story paths
    path('story/', views.StoryView.as_view()),
    path('updatestory/<int:pk>/', views.update_story, name='update-stories'),
    path('deletestory/<int:pk>/delete/', views.delete_story, name='delete-stories'),
    path('displaystory/<int:pk>/', views.display_story, name='display-story'),
    path('storyhomeview/', views.StoryHomeView.as_view(), name='story-home-view'),

    # studie paths
    path('studie/', views.StudieView.as_view()),
    path('updatestudie/<int:pk>/', views.update_studie, name='update-studie'),
    path('deletestudie/<int:pk>/delete/', views.delete_studie, name='delete-studie'),

    # Dashboard data
    path('alumnreport/', views.AlumnReportView.as_view()),
    path('studyreport/', views.StudyReportView.as_view()),
    path('', views.getRoutes),
    path('deletestudie/<int:pk>/', views.delete_studie, name='delete-studie'),
    
    #gallery paths
    path('gallery/', views.read_gallery,name='read-gallery'),
    path('gallery/create/', views.create_gallery, name='create-gallery'),
    path('updategallery/<int:pk>/', views.update_gallery, name='update-gallery'),
    path('deletegallery/<int:pk>/', views.delete_gallery, name='delete-gallery'),

    # opportunity paths
    path('opportunity/create/', views.create_opportunity, name='create-opportunity'),
    path('opportunity/', views.read_opportunity, name='read-opportunity'),
    path('opportunity/<int:pk>/delete/', views.DeleteOpportunityView.as_view(), name='delete-opportunity'),
    path('opportunity/<int:pk>/update/', views.UpdateOpportunityView.as_view(), name='update-opportunity'),
    path('opportunity/<int:pk>/approve', views.ApproveOpportunityView.as_view(), name='approve-opportunity'),

    # News paths
    path('news/', views.newsView.as_view(), name='news-list'),
    path('news/create/', views.create_news, name='news-create'),
    path('news/<int:pk>/update/', views.update_news, name='news-update'),
    path('news/<int:pk>/delete/', views.delete_news, name='news-delete'),
 
    # Dashboard data
    path('totalalumnreport/', views.AlumnReportView.as_view()),
    path('lumngradereport/', views.AlumnInGradeReportView.as_view()),
    path('empstureport/', views.EmploymentStudieReportView.as_view()),
    
    #export and import data using excel
    path('export-excel/', views.UsersExcelExportView.as_view()),
    path('excel-upload/', views.ExcelUploadAPIView.as_view(), name='excel-upload'),
    
    #upload data
    path('excel-data-upload/', views.AutoDataExcelUploadAPIView.as_view(), name='excel-data-upload'),
    path('excel-students-upload/', views.AutoStudentDataExcelUploadAPIView.as_view(), name='excel-students-upload'),
    
    path('excel-issue-upload/', views.AutoIssueDataExcelUploadAPIView.as_view(), name='excel-issue-upload'),
    
    #Genereting report
    path('generate-report/', views.Generate_reports.as_view(), name='generate-report'),

    path('alumni_count',alumni_count),
    
    #Library Management System 
    
    #Reg Teacher of Librarian
    
    path('bulkeducator/', views.TeacherOrLibrarianRegistrationView.as_view(), name='auth_registereducator'),
    path('bulkeducator/<int:id>/', views.TeacherOrLibrarianEditView.as_view(), name='auth_updateeducator'),
    #Reg Student
    
    path('bulkstudent/', views.StudentRegistrationView.as_view(), name='auth_registerstudent'),
    path('students/', views.StudentListDisplayAPIView.as_view(), name='students'),
    path('cstudent/', views.CheckStudentView.as_view(), name='checkstudent'),
    path('student/<int:pk>/', views.StudentRegistrationUpdateAPIView.as_view(), name='student-registration-update'),  
    path('exportstudentexcel/', views.StudentsReportExportAPIView.as_view(), name='student-export-data'),   
    #author paths
    path('author/',views.AuthorRegistrationView.as_view()),
    path('author/<int:pk>/delete/', views.delete_author, name='delete-author'),
    path('author/<int:pk>/', views.update_Author, name='update_author'),
    
    path('usersbooks/',views.UserList.as_view(), name='user_list'),
    
    #category paths
    path('category/',views.CategoryRegistrationView.as_view()),
    path('category/<int:pk>/delete/', views.delete_category, name='delete-category'),
    path('category/<int:pk>/', views.update_Category, name='update_category'),
    
    #book paths
    path('book/',views.BookRegistrationView.as_view()),
    path('books/',views.BookListDisplayAPIView.as_view()),
    path('exportbooks/',views.BookReportExportAPIView.as_view()),
    path('book/<int:pk>/delete/', views.delete_book, name='delete-book'),
    path('book/<int:pk>/', views.update_Book, name='update_book'),
    
    #Issue_Book paths
    path('issue/', views.Issue_BookRegistrationView.as_view(), name='issue_book_api'),
    path('issued/', views.IssuedBookDisplayAPIView.as_view(), name='issued_book_api'),
    path('exportissued/', views.Issued_BookReportExportAPIView.as_view(), name='issued_book_api_in_pdf'),
    path('exportoverdue/', views.Overdue_BookReportExportAPIView.as_view(), name='overdue_book_api_in_pdf'),
    path('issue/<int:pk>/delete/', views.delete_Issue_Book, name='delete-issue'),
    path('issue/<int:pk>/', views.update_Issue_Book, name='update_issue'),
    path('change-stpassword/', views.ChangeStudentPasswordView.as_view(), name='change-password'),
    #General report
    path('general/', views.GeneralReportDisplayAPIView.as_view(), name='general_report'),
    path('mostborrower/', views.MostBorrowerDisplayAPIView.as_view(), name='most_borrower_report'),
    path('gborrower/', views.BorrowerByGradeDisplayAPIView.as_view(), name='grade_borrower_report'),
    path('borrowers/', views.AllBorrowersDisplayAPIView.as_view(), name='borrowers_report'),
    
    #Atendance paths
    path('atendance/',views.AtendanceRegistrationView.as_view()),
    path('atendance/<int:pk>/delete/', views.delete_atendance, name='delete-atendance'),
    path('atendance/<int:pk>/', views.update_atendance, name='update_atendance'),
    
    path('term/',views.TermRegistrationView.as_view()),
    path('term/<int:pk>/delete/', views.delete_term, name='delete-term'),
    path('term/<int:pk>/', views.update_term, name='update_term'),

    path('', views.getRoutes)
]
