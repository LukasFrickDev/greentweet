from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from comments.models import Comment
from comments.serializers import CommentSerializer
from notifications.models import Notification


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Salva o comentário com o usuário autenticado
        comment = serializer.save(user=self.request.user)

        # Cria notificação para o autor do post (se não for o mesmo usuário)
        post = comment.post
        if post.author != self.request.user:
            Notification.objects.create(
                recipient=post.author,   # autor do post
                actor=self.request.user, # quem comentou
                type='comment',
                post=post
            )

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied("Você não pode editar comentários de outros usuários.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("Você não pode excluir comentários de outros usuários.")
        instance.delete()
