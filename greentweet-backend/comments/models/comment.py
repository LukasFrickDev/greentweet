from django.db import models
from django.contrib.auth import get_user_model
from posts.models import Post

User = get_user_model()

class Comment(models.Model):
    user = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)  # permite acessar user.comments.all()
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)    # permite acessar post.comments.all()
    content = models.TextField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} comentou no post {self.post.id}"
