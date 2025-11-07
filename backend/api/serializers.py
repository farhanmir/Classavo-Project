from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Chapter, Course, Enrollment, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["role", "bio"]
        extra_kwargs = {"bio": {"required": False}}


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "profile"]


class UserUpdateSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "profile"]
        read_only_fields = ["id", "username"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        # Update user fields
        instance.email = validated_data.get("email", instance.email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.save()

        # Update profile bio if provided
        if profile_data:
            if "bio" in profile_data:
                instance.profile.bio = profile_data["bio"]
                instance.profile.save()

        return instance


class PublicUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="profile.role", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "role"]


class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=["instructor", "student"], write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "role"]

    def validate_role(self, value):
        if value not in ["instructor", "student"]:
            raise serializers.ValidationError(
                "Role must be either 'instructor' or 'student'."
            )
        return value

    def create(self, validated_data):
        role = validated_data.pop("role")
        validated_data["password"] = make_password(validated_data["password"])
        user = User.objects.create(**validated_data)
        # Update the auto-created profile with the selected role
        user.profile.role = role
        user.profile.save()
        return user


class CourseListSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()
    chapter_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "created_by",
            "created_at",
            "student_count",
            "chapter_count",
        ]

    def get_created_by(self, obj):
        return {"id": obj.created_by.id, "username": obj.created_by.username}

    def get_student_count(self, obj):
        return obj.enrollments.count()

    def get_chapter_count(self, obj):
        return obj.chapters.count()


class CourseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    student_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "created_by",
            "created_at",
            "updated_at",
            "student_count",
            "is_enrolled",
        ]
        read_only_fields = ["created_by", "created_at", "updated_at"]

    def get_student_count(self, obj):
        return obj.enrollments.count()

    def get_is_enrolled(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.students.filter(id=request.user.id).exists()
        return False


class ChapterListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "title", "order", "is_public"]


class ChapterSerializer(serializers.ModelSerializer):
    course_title = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = [
            "id",
            "course",
            "title",
            "content",
            "order",
            "is_public",
            "created_at",
            "updated_at",
            "course_title",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def get_course_title(self, obj):
        return obj.course.title

    def validate_order(self, value):
        if value < 1:
            raise serializers.ValidationError("Order must be a positive number.")
        return value


class EnrollmentSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    course = CourseListSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "student", "course", "enrolled_at"]
