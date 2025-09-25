from rest_framework import serializers
from follows.models import Follow
from profiles.serializers import ProfileSerializer

class FollowSerializer(serializers.ModelSerializer):
    follower_profile = ProfileSerializer(source='follower.profile', read_only=True)
    following_profile = ProfileSerializer(source='following.profile', read_only=True)
    follower_username = serializers.CharField(source='follower.username', read_only=True)
    following_username = serializers.CharField(source='following.username', read_only=True)

    class Meta:
        model = Follow
        fields = [
            'id',
            'follower',
            'following',
            'created_at',
            'follower_profile',
            'following_profile',
            'follower_username',
            'following_username',
        ]
        read_only_fields = ['follower', 'created_at']
