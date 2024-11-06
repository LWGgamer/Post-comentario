import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

interface PrivateRouteProps {
  redirectTo?: string // URL para redirecionamento em caso de não autenticação
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectTo = '/' }): JSX.Element => {
  // Função para verificar se o usuário está autenticado
  const isAuthenticated = (): boolean => {
    // Obtém o token do localStorage
    const token = localStorage.getItem('token')
    // Verifica se o token existe e se não está expirado
    return !!token
  }

  // Se autenticado, renderiza o Outlet (conteúdo das rotas aninhadas)
  // Se não, redireciona para a página de login ou para a URL fornecida
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} />
}

export default PrivateRoute