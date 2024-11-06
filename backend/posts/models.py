from django.db import models

class Post(models.Model):
  title = models.CharField(max_length=200)
  content = models.TextField()
  pub_date = models.DateTimeField(auto_now_add=True)
  image = models.FileField(upload_to='posts/', null=True, blank=True)

  def __str__(self):
    return self.title
  
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')  # Relaciona com o post
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comentário no post "{self.post.title}"'