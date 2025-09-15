from rest_framework.routers import DefaultRouter
from follows.viewsets import FollowViewSet

router = DefaultRouter()
router.register(r'', FollowViewSet, basename='follow')

urlpatterns = router.urls
