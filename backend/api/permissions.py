from rest_framework import permissions


class IsInstructor(permissions.BasePermission):
    """
    Permission to check if user is an instructor.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role == "instructor"
        except:
            return False


class IsStudent(permissions.BasePermission):
    """
    Permission to check if user is a student.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.role == "student"
        except:
            return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission to allow read access to all authenticated users,
    but only allow write access to the owner.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated

        # Check if object is a Course or Chapter
        if hasattr(obj, "created_by"):
            return obj.created_by == request.user
        elif hasattr(obj, "course"):
            return obj.course.created_by == request.user

        return False


class IsEnrolledOrInstructor(permissions.BasePermission):
    """
    Permission to allow access to chapters if user is enrolled in the course
    or is the course instructor.
    """

    def has_object_permission(self, request, view, obj):
        # Public chapters should be accessible to everyone
        if obj.is_public and request.method in permissions.SAFE_METHODS:
            return True

        if not request.user.is_authenticated:
            return False

        # Course instructor has full access
        if obj.course.created_by == request.user:
            return True

        # Check if user is enrolled in the course
        return request.user in obj.course.students.all()


class CanEnroll(permissions.BasePermission):
    """
    Permission to check if a user can enroll in a course.
    User must be a student and not already enrolled.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        try:
            # Check if user is a student
            if request.user.profile.role != "student":
                return False

            # Check if user is not already enrolled
            return not obj.students.filter(id=request.user.id).exists()
        except:
            return False
