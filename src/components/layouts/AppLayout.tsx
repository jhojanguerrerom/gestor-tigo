import { NavLink, Outlet } from 'react-router-dom'
import logoTigo from '../../assets/logo-tigo-blanco.png'

/**
 * Layout principal para el flujo autenticado.
 * Incluye header con navegación y área de contenido.
 */
export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3">
          <div className="d-flex align-items-center gap-3">
            <img className="app-logo" src={logoTigo} alt="Tigo" />
            <div className="app-user">
              <span className="app-user__label">Bienvenido(a)</span>
              <span className="app-user__name">Jhojan Guerrero</span>
            </div>
          </div>

          <nav className="app-nav d-flex flex-wrap gap-2">
            <NavLink className="app-nav__link" to="/admin/home">
              Inicio admin
            </NavLink>
            <NavLink className="app-nav__link" to="/advisor/home">
              Inicio asesor
            </NavLink>
            <NavLink className="app-nav__link" to="/offers/managed">
              Ofertas gestionadas
            </NavLink>
          </nav>

          <button className="app-logout" type="button">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}
