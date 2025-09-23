from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from profiles.models import Profile
from profiles.serializers import ProfileSerializer

User = get_user_model()

class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        profile = Profile.objects.filter(user=request.user).first()
        if not profile:
            return Response({'error': 'Perfil não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path=r'(?P<username>[^/.]+)', permission_classes=[permissions.IsAuthenticated])
    def retrieve_by_username(self, request, username=None):
        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        profile = Profile.objects.filter(user=user).first()
        if not profile:
            return Response({'error': 'Perfil não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(profile)
        return Response(serializer.data)