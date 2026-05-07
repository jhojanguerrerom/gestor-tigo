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
- **Gestión de usuarios:** Alta, edición y visualización de usuarios desde el panel de administración.
- **Gestión de pausas:** Configuración de motivos de pausa y su administración.
- **Reportes de productividad:** Visualización de métricas de gestión por hora y por día, con gráficos interactivos.
- **Reportes de ingresos históricos:** Análisis de ingresos y gestiones por mes, rango personalizado y en tiempo real.
- **Notificaciones y feedback:** Sistema de notificaciones contextuales para acciones exitosas o con error.
- **Componentes reutilizables:** Modales, tablas, gráficos, selectores de fechas y layouts personalizables.
- **Hooks personalizados:** Lógica reutilizable para tablas, paginación, tooltips y autenticación.
- **Soporte para fuentes personalizadas:** Integración de la familia tipográfica DM Sans.
- **Gestión de iconos SVG:** Sistema centralizado de iconos y mapeo para UI consistente.


## Tecnologías Utilizadas

- **React 19** y **TypeScript**: UI moderna y tipado estático.
- **Vite**: Bundler rápido para desarrollo y producción.
- **React Router v7**: Enrutamiento avanzado y protección de rutas.
- **Axios**: Cliente HTTP para comunicación con APIs.
- **Bootstrap 5** y **Sass**: Estilos responsivos y personalizables.
- **Recharts**: Gráficas interactivas para reportes.
- **ESLint** y **Prettier**: Calidad y formato de código.
- **SVGR**: Carga y uso de iconos SVG como componentes React.
- **PostCSS** y **Autoprefixer**: Procesamiento de CSS moderno.


## Empezando

Sigue estos pasos para tener una copia local del proyecto:

### Variables de entorno

El proyecto requiere archivos `.env` para definir la URL de la API y otros parámetros. Ejemplos incluidos:

- `.env.development` (desarrollo)
- `.env.production` (producción)

Variables principales:

- `VITE_API_URL`: URL base de la API.
- `VITE_APP_NAME`: Nombre de la app.
- `VITE_APP_VERSION`: Versión de la app.
- `PORT`: Puerto del servidor local (opcional).

Puedes copiar y modificar estos archivos según tu entorno.

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

### Entornos

Usa `.env.development` para desarrollo local y `.env.production` para despliegue. Vite selecciona el archivo según el comando ejecutado.

### Ejecutando la aplicación

Para iniciar el servidor de desarrollo:

```sh
npm run dev
```

La app estará disponible en `http://localhost:5173` (o el puerto que asigne Vite).



## Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

- `npm run dev`: Inicia la app en modo desarrollo (`localhost:5173`).
- `npm run build`: Compila la app para producción en la carpeta `dist`.
- `npm run lint`: Analiza el código con ESLint.
- `npm run format`: Formatea el código con Prettier.
- `npm run preview`: Previsualiza la build de producción localmente.

Puedes usar `yarn` o `pnpm` si lo prefieres, adaptando los comandos.


## Estructura del Proyecto


El código fuente está en la carpeta `src` y sigue una estructura modular y escalable. A continuación se listan todas las carpetas y archivos principales, incluyendo los módulos y subcomponentes recientes:

```
src/
├── api/
│   ├── endpoints.ts
│   ├── httpClient.ts
│   ├── index.ts
│   └── services/
│       ├── actionService.ts
│       ├── authService.ts
│       ├── enlistmentService.ts
│       ├── offerService.ts
│       ├── PauseService.ts
│       ├── reportService.ts
│       └── userService.ts
├── assets/
│   ├── fonts/ (DMSans-*.ttf)
│   ├── icons/ (SVGs)
│   ├── logo-tigo-blanco.png
│   └── logo-tigo.png
├── auth/
│   ├── constants/
│   │   └── menuByRole.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   └── types/
│       └── auth.types.ts
├── components/
│   ├── BaseModal.tsx
│   ├── CustomChart.tsx
│   ├── DataTable.tsx
│   ├── DateRangePicker.tsx
│   ├── Loading.tsx
│   ├── MonthPicker.tsx
│   └── layouts/
│       └── AppLayout.tsx
├── context/
│   ├── ToastContainer.tsx
│   ├── ToastContext.tsx
│   └── ToastMessage.tsx
├── hooks/
│   ├── useBootstrapTooltips.ts
│   ├── useEnlistmentTable.ts
│   └── useTableSearchPagination.ts
├── icons/
│   ├── Icon.tsx
│   └── iconsMap.ts
├── pages/
│   ├── admin/
│   │   ├── actions/
│   │   │   ├── ActionsPage.tsx
│   │   │   └── ManageCatalogModal.tsx
│   │   ├── paused/
│   │   │   └── PauseSettingsPage.tsx
│   │   └── users/
│   │       ├── components/
│   │       │   ├── UserFormModal.tsx
│   │       │   └── UserTable.tsx
│   │       └── index.tsx
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── cases/
│   │   ├── components/
│   │   │   ├── OrderHistoryModal.tsx
│   │   │   ├── PausedCasesTab.tsx
│   │   │   └── ResolutionFormTab.tsx
│   │   └── index.tsx
│   ├── common/
│   │   └── NotFoundPage.tsx
│   ├── offers/
│   │   ├── GlobalSearchPage/
│   │   │   └── index.tsx
│   │   ├── OffersManagedPage/
│   │   │   └── index.tsx
│   │   ├── components/
│   │   │   └── OfferClosedHistoryModal.tsx
│   │   └── index.tsx
│   ├── orders/
│   │   ├── components/
│   │   │   ├── InTransitOrdersTab.tsx
│   │   │   ├── ManagementModal.tsx
│   │   │   ├── OfferHistoryModal.tsx
│   │   │   └── OpenOrdersTab.tsx
│   │   └── index.tsx
│   └── reports/
│       ├── HistoricalIncome/
│       │   ├── components/
│       │   │   ├── IncomeAndTransactionsDetailTab.tsx
│       │   │   ├── IncomeAndTransactionsMonthTab.tsx
│       │   │   ├── IncomeByConceptMonthTab.tsx
│       │   │   └── IncomeDayTab.tsx
│       │   └── index.tsx
│       └── Productivity/
│           ├── components/
│           │   ├── DailyProductivityTab.tsx
│           │   ├── HourlyTab.tsx
│           │   └── PendingByConceptTab.tsx
│           └── index.tsx
├── routes/
│   ├── AppProviders.tsx
│   ├── PrivateRoute.tsx
│   └── router.tsx
├── styles/
│   ├── app.scss
│   └── global.scss
├── utils/
│   ├── dateUtils.ts
│   └── downloadExcel.ts
├── App.tsx
└── main.tsx
```

#### Cambios y módulos recientes

- Se agregaron subcarpetas y componentes en `pages/admin/users/components`, `pages/cases/components`, `pages/offers/components`, `pages/orders/components`, `pages/reports/HistoricalIncome/components`, `pages/reports/Productivity/components`.
- Nuevo utilitario: `utils/downloadExcel.ts` para exportación de datos.
- Nuevos íconos SVG y variantes de fuentes en `assets/`.
- Estructura de carpetas y archivos alineada a una arquitectura modular y escalable.
- Se recomienda consultar cada subcarpeta para ver los componentes y utilidades disponibles.

> **Convención:** Los nuevos módulos y componentes se agregan bajo la estructura modular de `src/pages`, `src/components` o `src/utils` según su función. Consulta la estructura anterior para ver todos los archivos y submódulos actualizados.
├── assets/               # Imágenes, fuentes e iconos
│   ├── fonts/            # Fuentes DM Sans (ttf)
│   └── icons/            # Iconos SVG centralizados
├── auth/                 # Autenticación, roles y menús por rol
│   ├── constants/
│   │   └── menuByRole.ts # Menú dinámico según rol
│   ├── hooks/
│   │   └── useAuth.ts    # Hook de autenticación
│   └── types/
│       └── auth.types.ts # Tipos para autenticación y usuario
├── components/           # Componentes reutilizables
│   ├── BaseModal.tsx
│   ├── CustomChart.tsx
│   ├── DataTable.tsx
│   ├── DateRangePicker.tsx
│   ├── Loading.tsx
│   ├── MonthPicker.tsx
│   └── layouts/
│       └── AppLayout.tsx
├── context/              # Contextos globales (notificaciones, toast)
│   ├── ToastContainer.tsx
│   ├── ToastContext.tsx
│   └── ToastMessage.tsx
├── hooks/                # Hooks personalizados para lógica de UI y datos
│   ├── useBootstrapTooltips.ts
│   ├── useEnlistmentTable.ts
│   └── useTableSearchPagination.ts
├── icons/                # Componente y mapeo de iconos SVG
│   ├── Icon.tsx
│   └── iconsMap.ts
├── pages/                # Páginas principales y submódulos
│   ├── admin/
│   │   ├── actions/      # Gestión de acciones y subacciones
│   │   ├── paused/       # Configuración de parametros de pausa
│   │   └── users/        # Gestión de usuarios
│   ├── auth/             # Login
│   ├── cases/            # Resolución de casos y su historial
│   ├── common/           # Página de no encontrado
│   ├── offers/           # Consulta de ofertas cerradas
│   ├── orders/           # Gestión de pedidos abiertos/en tramite
│   └── reports/
│       ├── HistoricalIncome/ # Reportes de ingresos históricos
│       └── Productivity/     # Reportes de productividad
├── routes/                # Configuración de rutas y protección por rol
│   ├── AppProviders.tsx
│   ├── PrivateRoute.tsx
│   └── router.tsx
├── styles/                # Estilos globales y variables SCSS
│   ├── app.scss
│   └── global.scss
├── utils/                 # Utilidades generales (fechas, exportación)
│   ├── dateUtils.ts
│   └── downloadExcel.ts
├── App.tsx                # Componente raíz
└── main.tsx               # Punto de entrada
```

### Componentes destacados

- **Modales:** `BaseModal`, `ManageCatalogModal`, `UserFormModal`, `OrderHistoryModal`, `OfferClosedHistoryModal`, `PauseSettingsPage`, `ManagementModal`.
- **Tablas:** `DataTable`, `UserTable`, `PausedCasesTab`, `OpenOrdersTab`, `InTransitOrdersTab`.
- **Gráficos:** `CustomChart`, `DailyProductivityTab`, `HourlyTab`, `IncomeAndTransactionsDetailTab`, `IncomeByConceptMonthTab`, `IncomeDayTab`.
- **Selectores de fechas:** `DateRangePicker`, `MonthPicker`.
- **Layouts:** `AppLayout`.

> **Nota:** Consulta la estructura detallada arriba para ver todos los submódulos y componentes actualizados.

### Hooks personalizados

- `useAuth`, `useBootstrapTooltips`, `useEnlistmentTable`, `useTableSearchPagination`.

### Servicios API

- `actionService`, `authService`, `enlistmentService`, `offerService`, `PauseService`, `reportService`, `userService`.

> **Actualización:** Los servicios pueden crecer según nuevos endpoints agregados en el backend.

### Utilidades

- `dateUtils`, `downloadExcel`.

### Fuentes e iconos

- **Fuentes:** DM Sans (todas las variantes ttf en `assets/fonts/`).
- **Iconos:** SVG centralizados en `assets/icons/` y gestionados por `icons/`.


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
   - `/config/paused`: Configuración de motivos de pausa (**SUPER_USER**)
   - `/config/users`: Gestión de usuarios (**SUPER_USER**)
- Rutas no encontradas redirigen a `/login`.

   > El archivo `src/routes/router.tsx` define todas las rutas y su protección por rol.


## Autenticación y Autorización

El sistema de autenticación y autorización está basado en roles y tokens JWT. El componente `PrivateRoute` protege las rutas y verifica los permisos del usuario.

**Roles de usuario definidos:**

- `SUPER_USER`: Acceso total a todas las funcionalidades y administración.
- `SUPERVISOR`: Acceso a gestión de pedidos, ofertas y reportes.
- `VIEWER`: Acceso de solo lectura a reportes.
- `ASESOR`: Acceso a la resolución de casos asignados.

Cada usuario ve un menú y funcionalidades adaptadas a su rol.

---

## Dependencias principales

Revisa y actualiza las dependencias en `package.json` según sea necesario. Algunas principales:

- `react`, `react-dom`, `react-router-dom`, `axios`, `recharts`, `bootstrap`, `sass`, `xlsx`
- Linter y formateo: `eslint`, `prettier`, `typescript`, `vite`, `vite-plugin-svgr`

---

## Notas adicionales

- Usa Prettier y ESLint para mantener la calidad y formato del código.
- Los estilos globales y variables están en `src/styles/global.scss` y `app.scss`.
- Los iconos SVG se gestionan centralizadamente y pueden ser extendidos fácilmente.

---

Última actualización: 7 de mayo de 2026 (estructura y módulos revisados)
