from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from posts.models import Post
from posts.serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        if self.action == 'mine':
            return Post.objects.filter(author=self.request.user).order_by('-created_at')
        return super().get_queryset()

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("Você não pode editar posts de outros usuários.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise PermissionDenied("Você não pode excluir posts de outros usuários.")
        instance.delete()

    @action(detail=False, methods=['get'])
    def mine(self, request):
        posts = Post.objects.filter(author=request.user).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
