from rest_framework import serializers
from posts.models import Post
from comments.models import Comment

class FeedPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    is_liked = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'author',
            'author_username',
            'content',
            'image',
            'created_at',
            'is_liked',
            'comments_count',
        ]

    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def get_comments_count(self, obj):
        return obj.comments.count()

