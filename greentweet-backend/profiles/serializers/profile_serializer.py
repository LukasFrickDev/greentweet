from django.contrib.auth import get_user_model
from rest_framework import serializers
from profiles.models import Profile

UserModel = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    first_name = serializers.CharField(
        source='user.first_name', required=False, allow_blank=True
    )
    last_name = serializers.CharField(
        source='user.last_name', required=False, allow_blank=True
    )
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = ['id', 'user_id', 'username', 'first_name', 'last_name', 'bio', 'avatar']
        read_only_fields = ['id']
        extra_kwargs = {
            'avatar': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True},
        }

    def validate_username(self, value):
        if value and ' ' in value:
            raise serializers.ValidationError('O nome de usuário não pode conter espaços.')
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        avatar = data.get('avatar')
        request = self.context.get('request')
        if avatar and request is not None and not avatar.startswith('http'):
            data['avatar'] = request.build_absolute_uri(avatar)
        return data

    def validate_avatar(self, value):
        if value is None:
            return value
        content_type = getattr(value, 'content_type', '')
        if content_type and not content_type.startswith('image/'):
            raise serializers.ValidationError('O arquivo deve ser uma imagem.')
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError('A imagem não pode ultrapassar 2MB.')
        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        fields_to_update = []

        username = user_data.get('username')
        if username is not None:
            if ' ' in username:
                raise serializers.ValidationError({'username': 'O nome de usuário não pode conter espaços.'})
            if UserModel.objects.filter(username=username).exclude(pk=user.pk).exists():
                raise serializers.ValidationError({'username': 'Este nome de usuário já está em uso.'})
            user.username = username
            fields_to_update.append('username')

        first_name = user_data.get('first_name')
        if first_name is not None:
            user.first_name = first_name
            fields_to_update.append('first_name')

        last_name = user_data.get('last_name')
        if last_name is not None:
            user.last_name = last_name
            fields_to_update.append('last_name')

        if fields_to_update:
            user.save(update_fields=fields_to_update)

        avatar = validated_data.pop('avatar', serializers.empty)
        if avatar is not serializers.empty:
            if avatar is None:
                if instance.avatar:
                    instance.avatar.delete(save=False)
                instance.avatar = None
            else:
                instance.avatar = avatar

        return super().update(instance, validated_data)