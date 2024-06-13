from django.core.management.base import BaseCommand
from userprofile.models import *
from api.models import User


class Command(BaseCommand):
    help = 'Transfer data from Alumni to Kids_alumni'

    def handle(self, *args, **kwargs):
        alumni_records = Alumni.objects.all()

        for alumni in alumni_records:
            # Transfer the mapped fields from Alumni to Kids_alumni
            kids_alumni = Kids_alumni(
                user=alumni.user,
                date_of_birth=alumni.date_of_birth,
                gender=alumni.gender,
                reg_number=alumni.reg_number,
                father=alumni.father,
                mother=alumni.mother,
                did_you_born_in_rwanda=alumni.did_you_born_in_rwanda,
                place_of_birth_district_or_country=alumni.place_of_birth_district_or_country,
                place_of_birth_sector_or_city=alumni.place_of_birth_sector_or_city,
                life_status=alumni.life_status,
                marital_status=alumni.marital_status,
                currresidence_in_rwanda=alumni.currresidence_in_rwanda,
                currresidence_district_or_country=alumni.currresidence_district_or_country,
                currresidence_sector_or_city=alumni.currresidence_sector_or_city,
                family=alumni.family,
                s4marks=alumni.s4marks,
                s5marks=alumni.s5marks,
                s6marks=alumni.s6marks,
                ne=alumni.ne,
                maxforne=alumni.maxforne,
                decision=alumni.decision,
            )
            kids_alumni.save()

            # Add ManyToMany relationships
            kids_alumni.combination.set(alumni.combination.all())
            kids_alumni.eps.set(alumni.eps.all())

            self.stdout.write(self.style.SUCCESS(f'Successfully transferred {alumni.user.username}'))