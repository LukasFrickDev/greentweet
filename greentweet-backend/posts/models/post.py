from django.db import models
from django.contrib.auth import get_user_model




User = get_user_model()

class Post(models.Model):
    author = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    content = models.TextField(max_length=280)
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField('posts.Tag', related_name='tagged_posts', blank=True)

    def __str__(self):
        return f"{self.author.username}: {self.content[:30]}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        from posts.models import Tag
        from posts.utils.extract_hashtag import extract_hashtags   

        hashtags = extract_hashtags(self.content)
        self.tags.clear()
        for tag_name in hashtags:
            tag, _ = Tag.objects.get_or_create(name=tag_name.lower())
            self.tags.add(tag)


    


