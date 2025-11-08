from api.models import Chapter, Course, Enrollment, Profile
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = "Delete existing app data and create demo instructor, student, course, and chapters."

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.WARNING(
                "This will delete existing app data and replace with demo data."
            )
        )

        with transaction.atomic():
            # Delete dependent models first
            Enrollment.objects.all().delete()
            Chapter.objects.all().delete()
            Course.objects.all().delete()
            Profile.objects.all().delete()
            User.objects.all().delete()

            self.stdout.write(
                self.style.SUCCESS(
                    "Cleared Users, Profiles, Courses, Chapters, and Enrollments."
                )
            )

            # Create demo users
            User.objects.create_superuser(
                username="admin",
                email="admin@example.com",
                password="AdminPass123!",
            )

            instructor = User.objects.create_user(
                username="instructor",
                email="instructor@example.com",
                password="InstructorPass123!",
            )
            # The app creates a Profile via signals on user creation; update it
            if hasattr(instructor, "profile"):
                instructor.profile.role = "instructor"
                instructor.profile.bio = "Demo instructor account"
                instructor.profile.save()

            student = User.objects.create_user(
                username="student",
                email="student@example.com",
                password="StudentPass123!",
            )
            if hasattr(student, "profile"):
                student.profile.role = "student"
                student.profile.bio = "Demo student account"
                student.profile.save()

            self.stdout.write(
                self.style.SUCCESS(
                    "Created demo users: admin, instructor, student (passwords listed)."
                )
            )

            # Create a demo course
            course = Course.objects.create(
                title="Intro to Demo LMS",
                description="A short demo course created for the Classavo assignment.",
                created_by=instructor,
            )

            # Create chapters (Plate/Slate-like JSON structures)
            Chapter.objects.create(
                course=course,
                title="Welcome (Public)",
                content=[
                    {"type": "h2", "children": [{"text": "Welcome"}]},
                    {
                        "type": "p",
                        "children": [
                            {"text": "This is a public chapter visible to everyone."}
                        ],
                    },
                ],
                order=1,
                is_public=True,
            )

            Chapter.objects.create(
                course=course,
                title="Private Instructor Notes",
                content=[
                    {
                        "type": "p",
                        "children": [
                            {
                                "text": "This chapter is private and visible only to enrolled students."
                            }
                        ],
                    },
                ],
                order=2,
                is_public=False,
            )

            Chapter.objects.create(
                course=course,
                title="Resources (Public)",
                content=[
                    {
                        "type": "p",
                        "children": [
                            {"text": "Here are some useful resources and links."}
                        ],
                    },
                ],
                order=3,
                is_public=True,
            )

            # Enroll student
            Enrollment.objects.create(student=student, course=course)

            self.stdout.write(
                self.style.SUCCESS(
                    f"Created course '{course.title}' with 3 chapters and enrolled student."
                )
            )

        self.stdout.write(self.style.SUCCESS("Seeding complete."))
        self.stdout.write("")
        self.stdout.write("Credentials:")
        self.stdout.write("  admin@example.com / AdminPass123!")
        self.stdout.write("  instructor@example.com / InstructorPass123!")
        self.stdout.write("  student@example.com / StudentPass123!")
