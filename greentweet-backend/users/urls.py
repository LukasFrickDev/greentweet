from django.urls import path
from rest_framework.routers import DefaultRouter
from users.viewsets.register_viewset import RegisterViewSet
from users.views import me_view

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')

urlpatterns = [
    path('me/', me_view, name='me'),
] + router.urls