from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from likes.models import Like
from likes.serializers import LikeSerializer
from posts.models import Post

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        post_id = request.data.get('post')
        if not post_id:
            return Response({'error': 'Campo "post" é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        post = Post.objects.filter(id=post_id).first()
        if not post:
            return Response({'error': 'Post não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if not created:
            return Response({'error': 'Você já curtiu este post'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(LikeSerializer(like).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        like = self.get_object()
        if like.user != request.user:
            return Response({'error': 'Você não pode remover curtidas de outros usuários'}, status=status.HTTP_403_FORBIDDEN)
        like.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)