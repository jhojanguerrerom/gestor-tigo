import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom' // <-- Usamos Link en lugar de NavLink
import logoTigo from '../../assets/logo-tigo-blanco.png'
import { Icon } from '@/icons/Icon'
import { useAuth } from '@/auth/hooks/useAuth'
import { MENU_BY_ROLE } from '@/auth/constants/menuByRole'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const menu = user && user.profile_id ? MENU_BY_ROLE[user.profile_id] : []
  const navigate = useNavigate()
  const location = useLocation()

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
              const hasSubItems = item.subItems && item.subItems.length > 0;

              if (hasSubItems) {
                // Validamos si alguno de los hijos está activo para iluminar al Padre
                const isDropdownActive = item.subItems.some((sub: any) => location.pathname === sub.path);

                return (
                  <div key={item.label} className="app-nav__item--dropdown">
                    <span 
                      className={`app-nav__link dropdown-toggle ${isDropdownActive ? 'active' : ''}`} 
                      style={{ cursor: 'pointer' }}
                    >
                      {item.label}
                      <Icon name="arrow-down" size="xs" className="ms-1" />
                    </span>
                    
                    <div className="app-nav__submenu">
                      {item.subItems.map((sub: any) => {
                        // Validación exacta y manual
                        const isActive = location.pathname === sub.path;
                        
                        return (
                          <Link 
                            key={sub.path} 
                            to={sub.path} 
                            className={`app-nav__link submenu-item ${isActive ? 'active' : ''}`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Links normales sin hijos
              const isParentActive = location.pathname === item.path;
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`app-nav__link ${isParentActive ? 'active' : ''}`} 
                >
                  {item.label}
                </Link>
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