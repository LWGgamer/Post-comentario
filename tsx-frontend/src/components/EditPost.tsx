import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api'
import '../styles/EditPost.css'
import { IPost, IComment } from './types'

function EditPost(): JSX.Element {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string>('')
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState<string>('')

  useEffect(() => {
    if (!postId) return

    api.get<IPost>(`/posts/${postId}/`)
      .then(response => {
        setTitle(response.data.title)
        setContent(response.data.content)
        setImage(null) 
        setCurrentImage(response.data.image)
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do post:', error)
      })

    // Busca os comentários do post
    api.get<IComment[]>(`/posts/${postId}/comments/`)
      .then(response => setComments(response.data))
      .catch(error => console.error('Erro ao buscar comentários:', error))
  }, [postId])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      if (image && image.name !== currentImage) {
        formData.append('image', image);
      }

      if (postId) {
        await api.put(`/posts/${postId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Post atualizado com sucesso!')
      } else {
        await api.post(`/posts/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      navigate('/posts')
    } catch (error) {
      console.error('Erro ao salvar post:', error)
    }
  }

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!newComment) return

    try {
      const response = await api.post<IComment>(`/posts/${postId}/comments/`, { content: newComment })
      setComments(prevComments => [...prevComments, response.data])
      setNewComment('')
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    }
  }

  return (
    <div className="edit-post-container">
      <h1>{postId ? 'Editar Post' : 'Criar Novo Post'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {currentImage && <img src={currentImage} alt="Imagem do Post" className="post-image" />}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Conteúdo" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="save-button" type="submit">{postId ? 'Salvar' : 'Criar'}</button>
        <Link to="/posts">
          <button type="button" className="back-button">Voltar para Listagem</button>
        </Link>
      </form>

      {/* Seção de Comentários */}
      <div className="comments-section">
        <h2>Comentários</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Adicione um comentário"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Comentar</button>
        </form>

        <ul>
          {comments.map(comment => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EditPost
