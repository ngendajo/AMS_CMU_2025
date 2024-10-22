from celery import shared_task
from django.core.mail import send_mail
from userprofile.models import Attendance
from django.utils import timezone

@shared_task
def send_data_email(period):
    # Get today's date
    today = timezone.now().date()

    # Fetch attendance data for today's date and the specified period
    data = Attendance.objects.filter(date=today, period=period)

    # Check if there are any records for the given period today
    if data.exists():
        # Create a list of strings with student info, including numbering
        seen_names = set()
    
        # Create a list of strings with student info, including numbering
        email_body = "\n".join([
            f"{index + 1}. Student: {attendance.student_id.user.first_name} {attendance.student_id.user.last_name}, "
            f"Grade: {attendance.student_id.family.grade.grade_name}, "
            f"Family: {attendance.student_id.family.family_name}, "
            f"Combination: {attendance.student_id.combination.combination_name}"
            for index, attendance in enumerate(data)
            if (name := f"{attendance.student_id.user.first_name} {attendance.student_id.user.last_name}") not in seen_names and not seen_names.add(name)
    ])

        # Send the email
        send_mail(
            f'Absenteeism Report for Period {period} on {today}',  # Email subject
            email_body,  # Email body with today's attendance data for the given period
            'ngendajo@gmail.com',  # Sender email (replace with your email)
            ['diane.uwimana@asyv.org','joseph@asyv.org','stella@asyv.org','julius@asyv.org'],  # Recipient email (replace with actual recipient)
        )
    else:
        # Optionally send an email if no records are found for the period
        send_mail(
            f'No Absenteeism Records for Period {period} on {today}',  # Email subject
            f'There are no absenteeism records for period {period} on {today}.',  # Email body
            'ngendajo@gmail.com',  # Sender email (replace with your email)
            ['diane.uwimana@asyv.org','joseph@asyv.org','stella@asyv.org','julius@asyv.org'],  # Recipient email (replace with actual recipient)
        )
