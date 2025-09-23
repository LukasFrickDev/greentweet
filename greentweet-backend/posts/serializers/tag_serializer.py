from rest_framework import serializers
from posts.models import Tag, Post

class TagSerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['id', 'name', 'posts_count']

    def get_posts_count(self, obj):
        return obj.tagged_posts.count()
