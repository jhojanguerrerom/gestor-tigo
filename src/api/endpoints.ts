export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh-token',
    SESSIONS: '/sessions',
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
  },
  ACTIONS: {
    CATALOG: '/v1/ofertas/catalogo/acciones',
    SUBACTIONS: '/v1/ofertas/catalogo/subacciones',
  },
  REPORTS: {
    MANAGED_BY_HOUR: '/v1/reports/managed-by-hour',
    DAILY_PRODUCTIVITY: "/v1/reports/daily-productivity",
  }
} as const;