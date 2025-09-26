from rest_framework import serializers
from posts.models import Post
from comments.models import Comment

class FeedPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    is_liked = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

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
            'author_avatar',
        ]

    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_author_avatar(self, obj):
        request = self.context.get('request')
        profile = getattr(obj.author, 'profile', None)
        avatar = getattr(profile, 'avatar', None)
        if avatar:
            url = avatar.url
            if request is not None and not url.lower().startswith(("http://", "https://")):
                return request.build_absolute_uri(url)
            return url
        return None

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        url = obj.image.url
        if request is not None and not url.lower().startswith(("http://", "https://")):
            return request.build_absolute_uri(url)
        return url

