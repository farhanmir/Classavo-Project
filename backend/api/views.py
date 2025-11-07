from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Chapter, Course, Enrollment, Profile
from .permissions import (
    CanEnroll,
    IsEnrolledOrInstructor,
    IsInstructor,
    IsOwnerOrReadOnly,
    IsStudent,
)
from .serializers import (
    ChapterListSerializer,
    ChapterSerializer,
    CourseListSerializer,
    CourseSerializer,
    EnrollmentSerializer,
    ProfileSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data

            return Response(
                {
                    "user": user_data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            # Get user from username in request
            username = request.data.get("username")
            try:
                user = User.objects.get(username=username)
                user_data = UserSerializer(user).data
                response.data["user"] = user_data
            except User.DoesNotExist:
                pass

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        return CourseSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        elif self.action == "create":
            return [IsInstructor()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [IsOwnerOrReadOnly()]
        elif self.action == "enroll":
            return [IsAuthenticated(), CanEnroll()]
        elif self.action == "unenroll":
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Course.objects.all()
        instructor_id = self.request.query_params.get("instructor")

        if instructor_id:
            queryset = queryset.filter(created_by_id=instructor_id)

        return queryset.order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(methods=["post"], detail=True)
    def enroll(self, request, pk=None):
        course = self.get_object()

        # Check permission
        permission = CanEnroll()
        if not permission.has_object_permission(request, self, course):
            return Response(
                {"error": "You cannot enroll in this course"},
                status=status.HTTP_403_FORBIDDEN,
            )

        enrollment = Enrollment.objects.create(student=request.user, course=course)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=["delete"], detail=True)
    def unenroll(self, request, pk=None):
        course = self.get_object()

        try:
            enrollment = Enrollment.objects.get(student=request.user, course=course)
            enrollment.delete()
            return Response(
                {"message": "Unenrolled successfully"}, status=status.HTTP_200_OK
            )
        except Enrollment.DoesNotExist:
            return Response(
                {"error": "You are not enrolled in this course"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return ChapterListSerializer
        return ChapterSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsInstructor()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [IsOwnerOrReadOnly()]
        elif self.action == "retrieve":
            return [IsEnrolledOrInstructor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Chapter.objects.all()
        course_id = self.request.query_params.get("course_id")

        if course_id:
            queryset = queryset.filter(course_id=course_id)

            # Apply visibility rules for list action
            if self.action == "list":
                course = Course.objects.get(id=course_id)
                user = self.request.user

                # Show all chapters to instructor
                if user.is_authenticated and course.created_by == user:
                    return queryset

                # Show only public chapters or chapters from enrolled courses
                if user.is_authenticated and user in course.students.all():
                    return queryset
                else:
                    queryset = queryset.filter(is_public=True)

        return queryset.order_by("order")


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class MyCoursesView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Course.objects.filter(students=self.request.user).order_by(
            "-enrollments__enrolled_at"
        )
