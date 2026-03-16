import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import logoTigo from '../../assets/logo-tigo-blanco.png'
import { Icon } from '@/icons/Icon'
import { useAuth } from '@/auth/hooks/useAuth'
import { MENU_BY_ROLE } from '@/auth/constants/menuByRole'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const menu = user && user.profile_id ? MENU_BY_ROLE[user.profile_id] : []
  const navigate = useNavigate()
  const location = useLocation() // <-- Hook para leer la URL actual exacta

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
              <span className="app-user__name">{user?.full_name || 'Usuario'}</span>
            </div>
          </div>

          <nav className="app-nav d-flex flex-wrap gap-2">
            {menu.map((item: any) => {
              // Verificamos si tiene subItems
              const hasSubItems = item.subItems && item.subItems.length > 0;

              if (hasSubItems) {
                return (
                  <div key={item.label} className="app-nav__item--dropdown">
                    {/* El padre mantiene la clase app-nav__link para que se vea igual */}
                    <span className="app-nav__link dropdown-toggle" style={{ cursor: 'pointer' }}>
                      {item.label}
                      <Icon name="arrow-down" size="xs" className="ms-1" />
                    </span>
                    
                    {/* Lista de subopciones */}
                    <div className="app-nav__submenu">
                      {item.subItems.map((sub: any) => {
                        // VALIDACIÓN MANUAL ESTRICTA
                        const isActive = location.pathname === sub.path;
                        
                        return (
                          <NavLink 
                            key={sub.path} 
                            to={sub.path} 
                            className={`app-nav__link submenu-item ${isActive ? 'active' : ''}`}
                          >
                            {sub.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Link normal si no tiene hijos
              const isParentActive = location.pathname === item.path;
              
              return (
                <NavLink 
                  key={item.path} 
                  className={`app-nav__link ${isParentActive ? 'active' : ''}`} 
                  to={item.path}
                >
                  {item.label}
                </NavLink>
              );
            })}
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