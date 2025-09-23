from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from follows.models import Follow
from follows.serializers import FollowSerializer
from notifications.models import Notification


User = get_user_model()

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        following_id = request.data.get('following')
        if not following_id:
            return Response({'error': 'Campo "following" é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        if int(following_id) == request.user.id:
            return Response({'error': 'Você não pode seguir a si mesmo'}, status=status.HTTP_400_BAD_REQUEST)

        following_user = User.objects.filter(id=following_id).first()
        if not following_user:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        follow, created = Follow.objects.get_or_create(follower=request.user, following=following_user)
        if not created:
            return Response({'error': 'Você já segue este usuário'}, status=status.HTTP_400_BAD_REQUEST)
        
        if following_user != request.user:
            Notification.objects.create(
                recipient=following_user,
                actor=request.user,
                type='follow'
        )


        return Response(FollowSerializer(follow).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        follow = self.get_object()
        if follow.follower != request.user:
            return Response({'error': 'Você não pode deixar de seguir por outro usuário'}, status=status.HTTP_403_FORBIDDEN)
        follow.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
