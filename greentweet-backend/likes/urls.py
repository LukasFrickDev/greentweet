from rest_framework.routers import DefaultRouter
from likes.viewsets import LikeViewSet

router = DefaultRouter()
router.register(r'', LikeViewSet, basename='like')

urlpatterns = router.urls
