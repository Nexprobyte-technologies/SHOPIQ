from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, generate_12_digit_password
from .serializers import UserSerializer, UserCreateSerializer


class IsDevAdmin(permissions.BasePermission):
    """Only dev admins (status 1 / superuser) can manage users/admin accounts."""
    def has_permission(self, request, view):
        u = request.user
        return u and u.is_authenticated and (u.is_superuser or getattr(u, 'status', None) == 1)


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsDevAdmin]

    def get_serializer_class(self):
        if self.action in ('create', 'partial_update', 'update'):
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=['post'])
    def create_admin(self, request):
        """Dev admin creates an admin user (status 1-4) with optional auto 12-digit password."""
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()
        user.is_staff = True
        user.is_active = True
        user.save()
        return Response({
            'user': UserSerializer(user).data,
            'generated_password': getattr(user, '_generated_password', None),
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def auto_password(self, request):
        """Generate a 12-digit auto password (dev admin utility)."""
        return Response({'password': generate_12_digit_password()})


class RoleViewSet(viewsets.ViewSet):
    """Expose role/status metadata to the admin panels."""
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        return Response({
            'roles': dict(User.ROLE_CHOICES),
            'statuses': [{'value': k, 'label': v} for k, v in User.STATUS_CHOICES],
        })
