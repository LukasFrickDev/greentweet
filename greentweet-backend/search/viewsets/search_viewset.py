from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from posts.models import Post
from profiles.serializers import ProfileSerializer
from posts.serializers import PostSerializer

User = get_user_model()

class SearchViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'users': [], 'posts': []})

        users = User.objects.filter(username__icontains=query)
        posts = Post.objects.filter(content__icontains=query)

        user_profiles = [user.profile for user in users if hasattr(user, 'profile')]
        serialized_users = ProfileSerializer(user_profiles, many=True, context={'request': request}).data
        serialized_posts = PostSerializer(posts, many=True, context={'request': request}).data

        return Response({
            'users': serialized_users,
            'posts': serialized_posts
        })
