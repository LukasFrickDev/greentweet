from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from comments.models import Comment
from posts.models import Post


User = get_user_model()


class CommentListViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='reader', password='password123')
        self.author = User.objects.create_user(username='author', password='password123')
        self.post_with_comments = Post.objects.create(author=self.author, content='Primeiro post')
        self.other_post = Post.objects.create(author=self.author, content='Segundo post')
        self.empty_post = Post.objects.create(author=self.author, content='Post sem comentários')
        self.first_comment = Comment.objects.create(
            user=self.user,
            post=self.post_with_comments,
            content='Comentário do primeiro post',
        )
        self.other_comment = Comment.objects.create(
            user=self.author,
            post=self.other_post,
            content='Comentário do segundo post',
        )
        self.client.force_authenticate(user=self.user)

    def test_list_without_post_filter_returns_comments_from_all_posts(self):
        response = self.client.get('/comments/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertCountEqual(
            [comment['id'] for comment in response.data],
            [self.first_comment.id, self.other_comment.id],
        )

    def test_list_filters_comments_by_post(self):
        response = self.client.get(f'/comments/?post={self.post_with_comments.id}')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([comment['id'] for comment in response.data], [self.first_comment.id])
        self.assertNotIn(self.other_comment.id, [comment['id'] for comment in response.data])

    def test_list_returns_empty_list_when_post_has_no_comments(self):
        response = self.client.get(f'/comments/?post={self.empty_post.id}')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_rejects_invalid_post_filter(self):
        response = self.client.get('/comments/?post=invalid')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['post'], 'Informe um ID de post válido.')

    def test_list_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.get('/comments/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
