from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from .models import EventRegistration
from .serializers import EventRegistrationSerializer, PaymentVerificationSerializer


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling event registrations.
    """
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer

    def get_permissions(self):
        """
        Allow anyone to create registrations, but require authentication for list/retrieve.
        """
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """
        Create a new registration.
        Accepts multipart/form-data.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        """
        List all registrations (admin only).
        Supports filtering by payment_verified status.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        # Filter by payment verification status if provided
        payment_verified = request.query_params.get('payment_verified', None)
        if payment_verified is not None:
            payment_verified = payment_verified.lower() == 'true'
            queryset = queryset.filter(payment_verified=payment_verified)
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single registration (admin only).
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def verify(self, request, pk=None):
        """
        Update payment verification status and notes (admin only).
        """
        registration = self.get_object()
        serializer = PaymentVerificationSerializer(registration, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Return full registration data
        full_serializer = EventRegistrationSerializer(registration, context={'request': request})
        return Response(full_serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Admin login endpoint.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        if user.is_staff or user.is_superuser:
            login(request, user)
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username
                }
            })
        else:
            return Response(
                {'error': 'User does not have admin privileges'},
                status=status.HTTP_403_FORBIDDEN
            )
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    """
    Admin logout endpoint.
    """
    logout(request)
    return Response({'success': True, 'message': 'Logout successful'})


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_check(request):
    """
    Check if admin is logged in.
    Returns authenticated status without requiring authentication.
    """
    if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'email': request.user.email,
                'username': request.user.username
            }
        })
    else:
        return Response({
            'authenticated': False
        })
