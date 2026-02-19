import loginImage from '../../assets/logo-tigo-blanco.png'
import './auth.scss'
import { Icon } from '@/icons/Icon'

/**
 * Página de inicio de sesión.
 */
export default function LoginPage() {
  return (
    <section className='bg-blue'>
      <main className="container min-vh-100 d-flex align-items-center py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6 d-flex justify-content-center align-items-center">
            <img className="img-fluid w-50 mb-4 mb-sm-0" src={loginImage} alt="" />
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

              <form noValidate>
                <div className="group">      
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder=" "
                    required
                  />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label>Correo</label>
                </div>

                <div className="group">      
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder=" "
                    required
                  />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label>Contraseña</label>
                </div>

                <div className="d-flex flex-sm-row justify-content-between align-items-center mt-5">
                  <a className="link-primary" href="https://gestionatucuenta.tigoune.com/sigma/app/index?breakGlass=true#/forgot-password" target='_blank'>
                    ¿Olvidaste tu contraseña?
                  </a>
                  <button className="button button-blue text-uppercase" type="submit">
                      Entrar
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