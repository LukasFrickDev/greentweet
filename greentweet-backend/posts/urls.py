from rest_framework.routers import DefaultRouter
from posts.viewsets.post_viewset import PostViewSet
from posts.viewsets.feed_viewset import FeedViewSet
from posts.viewsets.tag_viewset import TagViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'feed', FeedViewSet, basename='feed')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = router.urls