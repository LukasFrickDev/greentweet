from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from posts.models import Post
from posts.serializers import FeedPostSerializer
from follows.models import Follow

class FeedViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        user = request.user
        followed_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)
        posts = Post.objects.filter(author__id__in=followed_ids).order_by('-created_at')


        limit = int(request.query_params.get('limit', 10))
        offset = int(request.query_params.get('offset', 0))
        paginated = posts[offset:offset + limit]

        serializer = FeedPostSerializer(paginated, many=True, context={'request': request})
        return Response(serializer.data)
