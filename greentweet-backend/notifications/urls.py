from rest_framework.routers import DefaultRouter
from notifications.viewsets.notification_viewset import NotificationViewSet

router = DefaultRouter()
router.register(r'', NotificationViewSet, basename='notification')

urlpatterns = router.urls
