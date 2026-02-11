import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './routes/AppProviders'
import { router } from './routes/router'

/**
 * Componente raíz de la aplicación.
 * Mantiene un layout mínimo y delega el enrutamiento.
 */
function App() {
  return (
    <AppProviders>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </AppProviders>
  )
}

export default App
