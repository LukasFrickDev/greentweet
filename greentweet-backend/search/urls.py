from django.urls import path
from search.viewsets import SearchViewSet

urlpatterns = [
    path('', SearchViewSet.as_view(), name='search')
]
