from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChapterViewSet,
    CourseViewSet,
    LoginView,
    LogoutView,
    MyCoursesView,
    ProfileView,
    RegisterView,
    UserDetailView,
)

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"chapters", ChapterViewSet, basename="chapter")

urlpatterns = [
    # Authentication endpoints
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # User profile endpoints
    path("profile/", ProfileView.as_view(), name="profile"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    # Student specific endpoints
    path("my-courses/", MyCoursesView.as_view(), name="my-courses"),
    # Nested chapters route
    path(
        "courses/<int:course_id>/chapters/",
        ChapterViewSet.as_view({"get": "list", "post": "create"}),
        name="course-chapters",
    ),
    # Router URLs (includes courses and chapters ViewSets)
    path("", include(router.urls)),
]
