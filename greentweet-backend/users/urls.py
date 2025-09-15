from rest_framework.routers import DefaultRouter
from users.viewsets.register_viewset import RegisterViewSet

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')

urlpatterns = router.urls