from rest_framework import routers
from posts.api import viewsets

posts_router = routers.DefaultRouter()
posts_router.register('posts', viewsets.PostViewSet)