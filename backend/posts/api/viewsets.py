from rest_framework import viewsets, permissions
from posts import models
from posts.api import serializers

class PostViewSet(viewsets.ModelViewSet):
  queryset = models.Post.objects.all()
  serializer_class = serializers.PostSerializer
  permission_classes = [permissions.IsAuthenticated]
