from django.contrib import admin

from .models import Chapter, Course, Enrollment, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "role", "bio"]
    list_filter = ["role"]
    search_fields = ["user__username", "user__email"]


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["title", "created_by", "created_at", "student_count"]
    list_filter = ["created_by", "created_at"]
    search_fields = ["title", "description"]

    def student_count(self, obj):
        return obj.enrollments.count()

    student_count.short_description = "Students Enrolled"


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ["title", "course", "order", "is_public", "created_at"]
    list_filter = ["course", "is_public", "created_at"]
    search_fields = ["title", "course__title"]
    ordering = ["course", "order"]


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ["student", "course", "enrolled_at"]
    list_filter = ["course", "enrolled_at"]
    search_fields = ["student__username", "course__title"]
