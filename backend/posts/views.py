from django.http import HttpRequest, HttpResponse
from django.views.generic import CreateView, DetailView, UpdateView, DeleteView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from django.shortcuts import redirect
from .models import Post, Comment
from .forms import CommentForm  # É necessário criar um formulário de comentário separado

# View para criar um novo post
class PostCreateView(CreateView):
    model = Post
    fields = ['title', 'content', 'image']
    template_name = 'posts/post_create.html'
    success_url = '/posts/'

# View para exibir os detalhes de um post específico, incluindo comentários
class PostDetailView(DetailView):
    model = Post
    template_name = 'posts/post_detail.html'
    context_object_name = 'post'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['comments'] = Comment.objects.filter(post=self.object)  # Filtra os comentários do post atual
        context['comment_form'] = CommentForm()  # Formulário para criar um novo comentário
        return context

# View para atualizar um post existente
class PostUpdateView(UpdateView):
    model = Post
    fields = ['title', 'content', 'image']
    template_name = 'posts/post_update.html'
    success_url = '/posts/'

# View para deletar um post existente
class PostDeleteView(DeleteView):
    model = Post
    template_name = 'posts/post_delete.html'
    success_url = reverse_lazy('post_list')

# View para listar todos os posts, apenas para usuários autenticados e pertencentes ao grupo 'editor'
class PostListView(LoginRequiredMixin, ListView):
    login_url = 'login'
    model = Post
    template_name = 'posts/post_list.html'
    context_object_name = 'posts'

    def dispatch(self, request, *args, **kwargs) -> HttpResponse:
        # Redireciona para o login se o usuário não estiver autenticado ou não for um 'editor'
        if self.request.user and not self.request.user.groups.filter(name='editor'):
            return redirect('login')
        return super().dispatch(request, *args, **kwargs)

# View para login personalizado
class CustomLoginView(LoginView):
    template_name = 'auth/login.html'

# View para logout personalizado
class CustomLogoutView(LogoutView):
    next_page = '/posts/'

# View para cadastro de novo usuário
class CustomRegisterView(CreateView):
    form_class = UserCreationForm
    template_name = 'auth/register.html'
    success_url = reverse_lazy('login')

# View para criar um novo comentário em um post específico
class CommentCreateView(CreateView):
    model = Comment
    form_class = CommentForm  # Formulário que criamos para comentários
    template_name = 'comments/comment_form.html'

    def form_valid(self, form):
        form.instance.post_id = self.kwargs['post_id']  # Define o post associado ao comentário
        form.instance.user = self.request.user  # Define o usuário que criou o comentário
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('post_detail', kwargs={'pk': self.kwargs['post_id']})
