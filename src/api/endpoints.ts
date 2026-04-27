export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh-token',
  },
  ENLISTMENT: {
    BASE: '/v1/enlistment',
    SEARCH: '/v1/enlistment/search/field',
  },
  OFFERS: {
    BASE: '/offers',
    IN_TRANSIT: '/v1/ofertas/en-tramite',
    MY_OFFER: '/v1/ofertas/mi-oferta',
    FREEZE: '/v1/ofertas/congelar',
    CONCEPTS: '/v1/ofertas/conceptos',
    MANAGE: '/v1/ofertas/gestionar',
    HISTORY: (oferta: string) => `/v1/ofertas/historico/${oferta}`,
    MANAGEMENT_DETAIL: (oferta: string) => `/v1/ofertas/gestion-detalle/${oferta}`,
    UNFREEZE: '/v1/ofertas/descongelar',
    REASSIGN: '/v1/ofertas/reasignar',
    PAUSE: '/v1/ofertas/pausar',
    PAUSED: '/v1/ofertas/mis-pausadas',
    RESUME: '/v1/ofertas/reanudar',
    PAUSE_CONFIG: '/v1/ofertas/config-pausada',
  },
  ACTIONS: {
    CATALOG: '/v1/ofertas/catalogo/acciones',
    SUBACTIONS: '/v1/ofertas/catalogo/subacciones',
  },
  REPORTS: {
    MANAGED_BY_HOUR: '/v1/reports/managed-by-hour',
    DAILY_PRODUCTIVITY: "/v1/reports/daily-productivity",
    HISTORICAL_INCOME: "/v1/reports/historical-income-vs-managed",
    DAILY_INCOME_MANAGED: "/v1/reports/daily-income-managed",
    INCOME_BY_HOUR: "/v1/reports/income-by-hour",
    INCOME_BY_CONCEPT: "/v1/reports/income-by-concept",
  },
  USERS: {
    BASE_USERS: '/v1/users/',
    BY_ID: (userId: number | string) => `/v1/users/${userId}`,
  }
} as const;