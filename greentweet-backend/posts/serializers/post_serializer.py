from rest_framework import serializers
from posts.models import Post

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    current_user_like_id = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)


    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_username', 'content', 'image',
            'created_at', 'tags',
            'likes_count', 'comments_count', 'is_liked', 'current_user_like_id',
            'author_avatar'

        ]
        read_only_fields = [
            'id', 'author', 'author_username', 'created_at', 'tags',
            'likes_count', 'comments_count', 'is_liked'
        ]
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
            'content': {'required': False, 'allow_blank': True},
        }

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        return user.is_authenticated and obj.likes.filter(user=user).exists()

    def get_current_user_like_id(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            like = obj.likes.filter(user=user).first()
            return like.id if like else None
        return None

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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        image = instance.image
        if image:
            request = self.context.get('request')
            url = image.url
            if request is not None and not url.lower().startswith(("http://", "https://")):
                data['image'] = request.build_absolute_uri(url)
            else:
                data['image'] = url
        else:
            data['image'] = None
        return data

    def validate(self, attrs):
        content = attrs.get('content', None)
        if content is not None:
            trimmed = content.strip()
            attrs['content'] = trimmed
            content_value = trimmed
        elif self.instance is not None:
            content_value = (self.instance.content or '').strip()
        else:
            content_value = ''

        image_attr = attrs.get('image', serializers.empty)
        if image_attr is serializers.empty:
            image_exists = bool(getattr(self.instance, 'image', None))
        else:
            image_exists = bool(image_attr)

        if not content_value and not image_exists:
            raise serializers.ValidationError('Envie um texto ou uma imagem para o post.')

        return attrs



    def validate_image(self, value):
        if value is None:
            return value
        content_type = getattr(value, 'content_type', '')
        if content_type and not content_type.startswith('image/'):
            raise serializers.ValidationError("O arquivo deve ser uma imagem.")
        if value and value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("A imagem não pode ultrapassar 2MB.")
        return value