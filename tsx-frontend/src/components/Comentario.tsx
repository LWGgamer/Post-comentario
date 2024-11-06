import React, { useState, useEffect, FormEvent } from 'react';
import api from '../api'; 

interface ComentarioProps {
  postId: string; 
}

interface IComentario {
  id: string;
  autor: string;
  conteudo: string;
  data: string;
}

const Comentario: React.FC<ComentarioProps> = ({ postId }) => {
  const [comentarios, setComentarios] = useState<IComentario[]>([]);
  const [novoComentario, setNovoComentario] = useState<string>('');

  // Função para buscar comentários do post
  useEffect(() => {
    api.get(`/posts/${postId}/comentarios`)
      .then(response => {
        setComentarios(response.data);
      })
      .catch(error => console.error('Erro ao buscar comentários:', error));
  }, [postId]);

  // Função para adicionar um novo comentário
  const handleAddComentario = (e: FormEvent) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    const comentarioData = {
      autor: 'Usuário', // Substitua por um nome real de usuário, se houver autenticação
      conteudo: novoComentario,
      data: new Date().toISOString(),
    };

    api.post(`/posts/${postId}/comentarios`, comentarioData)
      .then(response => {
        setComentarios([...comentarios, response.data]);
        setNovoComentario('');
      })
      .catch(error => console.error('Erro ao adicionar comentário:', error));
  };

  return (
    <div>
      <h2>Comentários</h2>
      <ul>
        {comentarios.map(comentario => (
          <li key={comentario.id}>
            <p><strong>{comentario.autor}:</strong> {comentario.conteudo}</p>
            <span>{new Date(comentario.data).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddComentario}>
        <input
          type="text"
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Escreva um comentário..."
        />
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
};

export default Comentario;
