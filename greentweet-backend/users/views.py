from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Retorna os dados do usuário logado
    GET /auth/me/
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'date_joined': user.date_joined
    })