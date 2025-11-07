from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
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
    PublicUserSerializer,
    RegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
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
            # Decode access token to get user ID instead of relying on username field
            try:
                from rest_framework_simplejwt.tokens import AccessToken

                access_token = response.data.get("access")
                token = AccessToken(access_token)
                user_id = token.get("user_id")

                if user_id:
                    user = User.objects.get(id=user_id)
                    user_data = UserSerializer(user).data
                    response.data["user"] = user_data
            except Exception:
                # Fall back gracefully if token decoding fails
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

        # DRF permissions already checked via get_permissions()
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
        if self.action == "list":
            return [AllowAny()]
        elif self.action == "retrieve":
            return [IsEnrolledOrInstructor()]
        elif self.action == "create":
            return [IsInstructor()]
        elif self.action in ["update", "partial_update", "destroy"]:
            return [IsOwnerOrReadOnly()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Chapter.objects.all()
        # Support both query params and URL kwargs for course_id
        course_id = self.request.query_params.get("course_id") or self.kwargs.get(
            "course_id"
        )

        if course_id:
            queryset = queryset.filter(course_id=course_id)

            # Filter chapters based on user permissions
            if self.action == "list":
                try:
                    course = Course.objects.get(id=course_id)
                except Course.DoesNotExist:
                    # Return empty queryset if course doesn't exist
                    return Chapter.objects.none()

                user = self.request.user

                # Show all chapters to instructor
                if user.is_authenticated and course.created_by == user:
                    return queryset

                # Show all chapters if user is enrolled, otherwise only public ones
                if user.is_authenticated and user in course.students.all():
                    return queryset
                else:
                    queryset = queryset.filter(is_public=True)

        return queryset.order_by("order")

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to enforce object-level permissions for chapters."""
        chapter = self.get_object()
        self.check_object_permissions(request, chapter)
        serializer = self.get_serializer(chapter)
        return Response(serializer.data)

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]
        # Make sure instructors can only add chapters to their own courses
        if course.created_by != self.request.user:
            raise PermissionDenied("You can only create chapters for your own courses.")
        serializer.save()


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = PublicUserSerializer
    permission_classes = [AllowAny]


class MyCoursesView(generics.ListAPIView):
    serializer_class = CourseListSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Course.objects.filter(students=self.request.user).order_by(
            "-enrollments__enrolled_at"
        )
