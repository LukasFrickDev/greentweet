from rest_framework import serializers
from comments.models import Comment

class CommentSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'user',           # quem comentou
            'user_username',  # nome do usuário
            'post',           # post relacionado
            'content',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'user', 'user_username']

