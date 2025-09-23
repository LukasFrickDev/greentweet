from django.db import models
from django.contrib.auth import get_user_model
from posts.models import Post

User = get_user_model()

class Like(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='likes'   # permite acessar user.likes.all()
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes'   # permite acessar post.likes.all()
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # evita curtidas duplicadas

    def __str__(self):
        return f"{self.user.username} curtiu {self.post.id}"

