from django.urls import path
from profiles.viewsets import MyProfileViewSet

urlpatterns = [
    path('me/', MyProfileViewSet.as_view(), name='my-profile'),
]
