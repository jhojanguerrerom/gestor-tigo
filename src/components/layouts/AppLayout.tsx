import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import logoTigo from '../../assets/logo-tigo-blanco.png'
import { Icon } from '@/icons/Icon'
import { useAuth } from '@/auth/hooks/useAuth'
import { MENU_BY_ROLE } from '@/auth/constants/menuByRole'

/**
 * Layout principal para el flujo autenticado.
 * Incluye header con navegación y área de contenido.
 */
export default function AppLayout() {
  const { user, logout } = useAuth()
  const menu = user && user.profile_id ? MENU_BY_ROLE[user.profile_id] : []
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3">
          <div className="d-flex align-items-center gap-3">
            <img className="app-logo" src={logoTigo} alt="Tigo" />
            <div className="app-user">
              <span className="app-user__label">Bienvenido(a)</span>
              <span className="app-user__name">{user?.full_name || 'Usuario'} <small>{'rol: '+user?.profile_id}</small></span>
            </div>
          </div>

          <nav className="app-nav d-flex flex-wrap gap-2">
            {menu.map((item: any) => (
              <NavLink key={item.path} className="app-nav__link" to={item.path}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button className="app-logout" type="button" onClick={handleLogout}>
            Cerrar sesión
            <Icon name="close" size="xl" className="ms-2 bg-light ps-1 rounded-3" />
          </button>
        </div>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}