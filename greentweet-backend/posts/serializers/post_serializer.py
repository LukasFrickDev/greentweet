from rest_framework import serializers
from posts.models import Post

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'author', 'author_username', 'content', 'image', 'created_at', 'tags']
        read_only_fields = ['id', 'author', 'author_username', 'created_at', 'tags']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True}  
        }


    def validate_image(self, value):
        if value is None:
            return value
        # valida tipo
        if value and not value.content_type.startswith('image/'):
            raise serializers.ValidationError("O arquivo deve ser uma imagem.")
        # valida tamanho (2MB)
        if value and value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("A imagem não pode ultrapassar 2MB.")
        return value
