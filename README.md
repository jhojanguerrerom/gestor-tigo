# gestor-tigo

## Descripción del proyecto
Aplicación frontend en React pensada para evolucionar hacia la integración de endpoints. La arquitectura prioriza claridad, escalabilidad y mantenibilidad, con UI mínima y estilos organizados por vista.

## Tecnologías
- React
- TypeScript
- Vite
- React Router
- Bootstrap (clases básicas)
- SCSS
- ESLint
- Prettier

## Arquitectura
- Enrutamiento declarativo con React Router (`createBrowserRouter`).
- Separación por dominios y capas (páginas, rutas, componentes, hooks, utils).
- `AppProviders` como punto único para agregar contextos en el futuro.
- `api` y `auth` como carpetas placeholder para integración posterior.

## Flujo de renderizado
- `main.tsx` monta la app en el DOM.
- `App.tsx` aplica layout mínimo y delega el enrutamiento.
- `router.tsx` define rutas hacia páginas.

## Integración futura API REST
- `api/httpClient.ts` centralizará el cliente HTTP.
- `api/endpoints.ts` definirá rutas de endpoints.
- `api/index.ts` expondrá servicios agregados.
- Las páginas consumirán servicios a través de `services/` por dominio.

## Estructura de carpetas
```
src/
  api/
    index.ts
    endpoints.ts
    httpClient.ts
  auth/
    components/
    context/
    guards/
    hooks/
    services/
    types/
    styles/
  components/
    layouts/
    ui/
  hooks/
  pages/
    auth/
      LoginPage.tsx
      auth.scss
    dashboard/
      DashboardPage.tsx
    common/
      NotFoundPage.tsx
  routes/
    router.tsx
    AppProviders.tsx
  styles/
    global.scss
  types/
  utils/
  assets/
```

## Instalación
1. Instala dependencias:
   - `npm install`
2. Inicia el servidor de desarrollo:
   - `npm run dev`

## Scripts
- `npm run dev`: desarrollo local.
- `npm run build`: build de producción.
- `npm run preview`: previsualización del build.
- `npm run lint`: linting.
- `npm run format`: formateo con Prettier.

## Convenciones
- Documentación y comentarios en español.
- Tipado estricto con TypeScript.
- Rutas definidas solo en `routes/router.tsx`.
- Estilos globales en `styles/global.scss`.
- Estilos por vista en `pages/**/`.

## Estilos
- Globales en `styles/global.scss`.
- SCSS por vista dentro de `pages/**`.
- Bootstrap para layout y utilidades básicas.

## Iconos SVG (SVGR)
- Los SVG viven en `src/assets/icons/`.
- Se cargan automáticamente con `import.meta.glob`.
- Se exponen como componentes React con `vite-plugin-svgr`.
- Los tamaños se controlan **solo** con clases (`icon--xs` a `icon--xl`).
- No se sobreescribe `fill` ni `stroke` (los SVG mantienen sus colores originales).

### Ejemplo de uso
```tsx
import { Icon } from './icons/Icon'

export const Example = () => (
  <div className="d-flex align-items-center gap-2">
    <Icon name="calendar-day" size="md" aria-label="Calendario" />
    <span>Agenda</span>
  </div>
)
```

## Accesibilidad
- Uso de etiquetas semánticas (`section`, `header`, `main`).
- Títulos claros por vista (`h1`).
- Evitar contraste insuficiente en estilos futuros.

## Buenas prácticas
- Mantener componentes pequeños y enfocados.
- Evitar lógica de negocio en vistas.
- Centralizar futuras llamadas HTTP en `api/`.
- Usar hooks reutilizables en `hooks/`.
- Mantener consistencia de estilos y nombres.
