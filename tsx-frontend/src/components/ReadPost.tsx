import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'
import '../styles/ReadPost.css'
import { IPost } from './types'

function ReadPost(): JSX.Element {
  const { postId } = useParams<{ postId: string }>()

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [image, setImage] = useState<string>('')

  useEffect(() => {
    api.get<IPost>(`/posts/${postId}/`)
      .then(response => {
        setTitle(response.data.title)
        setContent(response.data.content)
        setImage(response.data.image)
      })
      .catch(error => {
        console.error('Erro ao buscar detalhes do post:', error)
      })
  }, [postId])

  return (
    <div className="read-post-container">
      <h1>Detalhes do Post</h1>
      <Link to="/posts">
        <button type="button" className="back-button">Voltar para Listagem</button>
      </Link>
      <h2>{title}</h2>
      <p>{content}</p>
      {image && <img src={image} alt="Imagem do Post" className="post-image" />}
    </div>
  )
}

export default ReadPost