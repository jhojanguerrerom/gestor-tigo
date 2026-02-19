import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import loginImage from '@/assets/logo-tigo-blanco.png'
import './auth.scss'
import { Icon } from '@/icons/Icon'
import { useAuth } from '@/auth/hooks/useAuth'
import { UserRole } from '@/auth/types/auth.types'

const RECOVERY_URL = "https://gestionatucuenta.tigoune.com/sigma/app/index?breakGlass=true#/forgot-password"

/**
 * Página de inicio de sesión.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error, user } = useAuth()
  const navigate = useNavigate()

  // Redirigir si la sesión está activa
  useEffect(() => {
    console.log('user:', user, 'error:', error, 'loading:', loading)
    if (user && user.profile_id && error === null && loading === false) {
      switch (user.profile_id) {
        case UserRole.SUPER_USER:
        case UserRole.SUPERVISOR:
        case UserRole.VIEWER:
          navigate('/orders/home')
          break
        case UserRole.ASESOR:
          navigate('/advisor/home')
          break
        default:
          navigate('/orders/home')
      }
    }
  }, [user, error, loading, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) return

    const result = await login({ username, password })
    if (result.success) {
      // Redirección basada en rol
      switch (result.role) {
        case UserRole.SUPER_USER:
        case UserRole.SUPERVISOR:
        case UserRole.VIEWER:
          navigate('/orders/home')
          break
        case UserRole.ASESOR:
          navigate('/advisor/home')
          break
        default:
          navigate('/orders/home')
      }
    }
  }

  return (
    <section className='bg-blue'>
      <main className="container min-vh-100 d-flex align-items-center py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
            <img className="img-fluid w-50 mb-4 mb-sm-0" src={loginImage} alt="Logo Tigo" />
          </div>
          <div className="col-12 col-lg-5 d-flex align-items-center">
            <div className="w-100 container-login p-4 p-md-5 bg-white shadow-sm">
              <header className="mb-4 text-center text-lg-start">
                <h1 className="h2 mb-2 text-center font-dm-bold"><Icon name="window" size="xl" className="me-2 icon--sxl" />Gestor de operaciones</h1>
                <hr />
                <h3 className="h5 mb-2 font-dm-semibold">Iniciar sesión</h3>
                <p className="text-body-secondary mb-0 font-dm-regular">
                  Accede con tus credenciales para continuar.
                </p>
              </header>

              <form noValidate onSubmit={handleSubmit}>
                <div className="group">      
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder=" "
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label>Usuario</label>
                </div>

                <div className="group">      
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label>Contraseña</label>
                </div>
                {error && (
                  <div className="alert alert-danger p-2" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-flex flex-sm-row justify-content-between align-items-center mt-5">
                  <a 
                    className="link-primary" 
                    href={RECOVERY_URL} 
                    target='_blank' 
                    rel="noopener noreferrer"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                  <button 
                    className="button button-blue text-uppercase" 
                    type="submit"
                    disabled={loading}
                  >
                      {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  )
}