from rest_framework import serializers
from notifications.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_username = serializers.CharField(source='actor.username', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'type', 'actor_username', 'post', 'is_read', 'created_at']
