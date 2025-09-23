from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from posts.models import Tag, Post
from posts.serializers import FeedPostSerializer, TagSerializer

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = "name"                     #  busca pela coluna "name"
    lookup_value_regex = "[^/]+"              #  aceita strings com letras/números

    @action(detail=True, methods=['get'])
    def posts(self, request, name=None):
        tag = self.get_object()
        posts = Post.objects.filter(tags=tag).order_by('-created_at')
        serializer = FeedPostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

