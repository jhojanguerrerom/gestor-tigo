# Gestor Tigo

## Descripción

Este es un proyecto de frontend para una aplicación de gestión interna de Tigo. La aplicación permite a los usuarios gestionar pedidos, casos, ofertas y acciones administrativas según su rol.

## Características

- **Autenticación de usuarios:** Sistema de inicio de sesión para acceder a las funcionalidades de la aplicación.
- **Enrutamiento protegido:** Rutas privadas que solo permiten el acceso a usuarios autenticados y con roles específicos.
- **Gestión de pedidos:** Visualización y gestión de pedidos.
- **Resolución de casos:** Interfaz para la resolución de casos de clientes.
- **Gestión de ofertas:** Administración de ofertas.
- **Panel de administración:** Configuración de acciones y otros catálogos del sistema.

## Tecnologías Utilizadas

- **React:** Biblioteca de JavaScript para construir interfaces de usuario.
- **Vite:** Herramienta de frontend para un desarrollo y construcción rápidos.
- **TypeScript:** Superset de JavaScript que añade tipado estático.
- **React Router:** Para el enrutamiento en la aplicación.
- **Axios:** Cliente HTTP para realizar peticiones a la API.
- **Bootstrap:** Framework de CSS para el diseño de la interfaz.
- **Sass:** Preprocesador de CSS para un código más mantenible.
- **ESLint:** Para el análisis de código estático y la identificación de problemas.
- **Prettier:** Para el formateo de código.

## Empezando

Sigue estas instrucciones para tener una copia del proyecto funcionando en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

Necesitarás tener Node.js y npm (o yarn/pnpm) instalados en tu sistema.

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)

### Instalación

1.  Clona el repositorio:
    ```sh
    git clone <URL_DEL_REPOSITORIO>
    ```
2.  Navega al directorio del proyecto:
    ```sh
    cd gestor-tigo
    ```
3.  Instala las dependencias:
    ```sh
    npm install
    ```

### Ejecutando la aplicación

Para iniciar el servidor de desarrollo, ejecuta:

```sh
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

- `npm run dev`: Inicia la aplicación en modo de desarrollo.
- `npm run build`: Compila la aplicación para producción en la carpeta `dist`.
- `npm run lint`: Ejecuta ESLint para analizar el código en busca de errores y advertencias.
- `npm run format`: Formatea todos los archivos del proyecto con Prettier.
- `npm run preview`: Sirve la build de producción localmente para previsualizarla.

## Estructura del Proyecto

El código fuente de la aplicación se encuentra en la carpeta `src` y sigue una estructura modular:

```
src/
├── api/            # Lógica para peticiones HTTP (axios, endpoints, servicios)
├── assets/         # Archivos estáticos como imágenes, fuentes e iconos
├── auth/           # Lógica relacionada con la autenticación y autorización
├── components/     # Componentes de React reutilizables
├── context/        # Contextos de React (ej. para notificaciones)
├── hooks/          # Hooks de React personalizados
├── icons/          # Componente para renderizar iconos SVG
├── pages/          # Componentes que representan las páginas de la aplicación
├── routes/         # Configuración del enrutamiento y rutas protegidas
├── styles/         # Estilos globales y de la aplicación (SCSS)
├── App.tsx         # Componente raíz de la aplicación
└── main.tsx        # Punto de entrada de la aplicación
```

## Enrutamiento

La aplicación utiliza `react-router-dom` para gestionar la navegación. Las rutas principales son:

- `/login`: Página de inicio de sesión.
- `/`: Redirige a `/login`.
- Rutas protegidas que requieren autenticación:
    - `/orders/home`: Página de inicio de pedidos.
    - `/advisor/home`: Página de inicio para asesores.
    - `/offers/managed`: Página de gestión de ofertas.
    - `/config/actions`: Página de configuración de acciones (solo para administradores).

## Autenticación y Autorización

La aplicación cuenta con un sistema de autenticación y autorización basado en roles. Las rutas están protegidas mediante el componente `PrivateRoute`, que verifica si el usuario tiene los permisos necesarios para acceder a una página.

Los roles de usuario definidos son:
- `SUPER_USER`
- `SUPERVISOR`
- `VIEWER`
- `ASESOR`
