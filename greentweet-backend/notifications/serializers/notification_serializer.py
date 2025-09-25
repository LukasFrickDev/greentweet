from rest_framework import serializers
from notifications.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_username = serializers.CharField(source='actor.username', read_only=True)
    post_id = serializers.IntegerField(source='post.id', read_only=True)
    post_content = serializers.CharField(source='post.content', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'type',
            'actor_username',
            'post_id',
            'post_content',
            'is_read',
            'created_at',
        ]