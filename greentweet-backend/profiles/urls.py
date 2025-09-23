from rest_framework.routers import DefaultRouter
from profiles.viewsets import ProfileViewSet

router = DefaultRouter()
router.register(r'', ProfileViewSet, basename='profile')

urlpatterns = router.urls