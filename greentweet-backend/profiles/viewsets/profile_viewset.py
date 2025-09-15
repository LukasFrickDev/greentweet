from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from profiles.models import Profile
from profiles.serializers import ProfileSerializer

class MyProfileViewSet(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
