# Gestor Tigo

## Descripción

Este es un proyecto de frontend para una aplicación de gestión interna de Tigo. La aplicación permite a los usuarios gestionar pedidos, casos, ofertas y acciones administrativas según su rol.

## Características

- **Autenticación de usuarios:** Sistema de inicio de sesión y control de acceso basado en roles.
- **Enrutamiento protegido:** Rutas privadas para usuarios autenticados y con permisos según su rol.
- **Gestión de pedidos:** Visualización, gestión y reasignación/liberación de pedidos abiertos y en tránsito.
- **Resolución de casos:** Interfaz para la gestión y resolución de casos, con historial y acciones asociadas.
- **Gestión de ofertas:** Administración y consulta de ofertas cerradas, con filtros por fecha y búsqueda avanzada.
- **Panel de administración:** Gestión de acciones y subacciones del sistema mediante un catálogo editable.
- **Reportes de productividad:** Visualización de métricas de gestión por hora y por día, con gráficos interactivos.
- **Reportes de ingresos históricos:** Análisis de ingresos y gestiones por mes, rango personalizado y en tiempo real.
- **Notificaciones y feedback:** Sistema de notificaciones contextuales para acciones exitosas o con error.

## Tecnologías Utilizadas

- **React 19** y **TypeScript**: UI moderna y tipado estático.
- **Vite**: Bundler rápido para desarrollo y producción.
- **React Router v7**: Enrutamiento avanzado y protección de rutas.
- **Axios**: Cliente HTTP para comunicación con APIs.
- **Bootstrap 5** y **Sass**: Estilos responsivos y personalizables.
- **Recharts**: Gráficas interactivas para reportes.
- **ESLint** y **Prettier**: Calidad y formato de código.

## Empezando

Sigue estos pasos para tener una copia local del proyecto:

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- npm, yarn o pnpm

### Instalación

1. Clona el repositorio:
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Entra al directorio del proyecto:
   ```sh
   cd gestor-tigo
   ```
3. Instala las dependencias:
   ```sh
   npm install
   ```

### Ejecutando la aplicación

Para iniciar el servidor de desarrollo:

```sh
npm run dev
```

La app estará disponible en `http://localhost:5173` (o el puerto que asigne Vite).

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

- `npm run dev`: Inicia la app en modo desarrollo (`localhost:5173`).
- `npm run build`: Compila la app para producción en la carpeta `dist`.
- `npm run lint`: Analiza el código con ESLint.
- `npm run format`: Formatea el código con Prettier.
- `npm run preview`: Previsualiza la build de producción localmente.

## Estructura del Proyecto

El código fuente está en la carpeta `src` y sigue una estructura modular y escalable:

```
src/
├── api/            # Lógica para peticiones HTTP (axios, endpoints, servicios)
│   └── services/   # Servicios para dominios: pedidos, ofertas, reportes, acciones...
├── assets/         # Imágenes, fuentes e iconos
├── auth/           # Autenticación, roles y menús por rol
├── components/     # Componentes reutilizables (modales, tablas, gráficos...)
├── context/        # Contextos globales (notificaciones, toast)
├── hooks/          # Hooks personalizados para lógica de UI y datos
├── icons/          # Componente y mapeo de iconos SVG
├── pages/          # Páginas principales y submódulos (pedidos, casos, ofertas, reportes, admin)
│   ├── orders/     # Gestión de pedidos abiertos/en tránsito
│   ├── cases/      # Resolución de casos y su historial
│   ├── offers/     # Consulta de ofertas cerradas
│   ├── admin/      # Catálogo de acciones y subacciones
│   └── reports/    # Reportes de productividad e ingresos
├── routes/         # Configuración de rutas y protección por rol
├── styles/         # Estilos globales y variables SCSS
├── App.tsx         # Componente raíz
└── main.tsx        # Punto de entrada
```

## Enrutamiento

La aplicación utiliza `react-router-dom` para la navegación y protección de rutas según el rol del usuario. Las rutas principales y sus permisos son:

- `/login`: Página de inicio de sesión.
- `/`: Redirige a `/orders/home` si el usuario está autenticado.
- Rutas protegidas:
    - `/orders/home`: Gestión de pedidos abiertos y en tránsito (**SUPER_USER**, **SUPERVISOR**)
    - `/advisor/home`: Resolución de casos (**ASESOR**)
    - `/offers/managed`: Consulta de ofertas cerradas (**SUPER_USER**, **SUPERVISOR**)
    - `/reports/management-by-hour`: Reporte de productividad por hora y día (**SUPER_USER**, **SUPERVISOR**, **VIEWER**)
    - `/reports/historical-income`: Reporte de ingresos históricos y en tiempo real (**SUPER_USER**, **SUPERVISOR**, **VIEWER**)
    - `/config/actions`: Gestión de catálogo de acciones y subacciones (**SUPER_USER**)
- Rutas no encontradas redirigen a `/login`.

## Autenticación y Autorización

El sistema de autenticación y autorización está basado en roles y tokens JWT. El componente `PrivateRoute` protege las rutas y verifica los permisos del usuario.

**Roles de usuario definidos:**

- `SUPER_USER`: Acceso total a todas las funcionalidades y administración.
- `SUPERVISOR`: Acceso a gestión de pedidos, ofertas y reportes.
- `VIEWER`: Acceso de solo lectura a reportes.
- `ASESOR`: Acceso a la resolución de casos asignados.

Cada usuario ve un menú y funcionalidades adaptadas a su rol.
