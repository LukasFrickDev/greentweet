from rest_framework import viewsets, permissions
from notifications.models import Notification
from notifications.serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Apenas notificações do usuário logado
        return Notification.objects.filter(recipient=self.request.user)

    def perform_create(self, serializer):
        # Garante que a notificação sempre tenha um recipient válido
        serializer.save()
