from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from follows.models import Follow
from follows.serializers import FollowSerializer
from profiles.models import Profile
from profiles.serializers import ProfileSerializer

User = get_user_model()


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Profile.objects.select_related('user')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        return super().get_queryset().select_related('user')

    def perform_update(self, serializer):
        profile = serializer.instance
        if profile.user != self.request.user:
            raise PermissionDenied('Você só pode editar o seu próprio perfil.')
        serializer.save()

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        profile = Profile.objects.filter(user=request.user).select_related('user').first()
        if not profile:
            return Response({'error': 'Perfil não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path=r'username/(?P<username>[^/.]+)', permission_classes=[permissions.IsAuthenticated])
    def retrieve_by_username(self, request, username=None):
        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        profile = Profile.objects.filter(user=user).select_related('user').first()
        if not profile:
            return Response({'error': 'Perfil não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        profile = self.get_object()
        followers = Follow.objects.filter(following=profile.user).select_related('follower', 'following')
        serializer = FollowSerializer(followers, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        profile = self.get_object()
        following = Follow.objects.filter(follower=profile.user).select_related('follower', 'following')
        serializer = FollowSerializer(following, many=True, context={'request': request})
        return Response(serializer.data)