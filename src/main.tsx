import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/global.scss'
import App from './App'

/**
 * Punto de entrada de la aplicación.
 */
const root = createRoot(document.getElementById('root')!)

root.render(
    <App />,
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
