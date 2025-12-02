from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistrationViewSet, admin_login, admin_logout, admin_check

router = DefaultRouter()
router.register(r'registrations', RegistrationViewSet, basename='registration')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/admin/login/', admin_login, name='admin-login'),
    path('api/admin/logout/', admin_logout, name='admin-logout'),
    path('api/admin/check/', admin_check, name='admin-check'),
]

