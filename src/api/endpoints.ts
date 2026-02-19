export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh-token',
    SESSIONS: '/sessions',
  },
  AUTOMATION: {
    GET_DATA_FENIX: '/v1/getdatafenix',
    GET_DATA_SIEBEL: '/v1/getdatasiebel',
  },
  ENLISTMENT: {
    BASE: '/v1/enlistment',
  }
} as const;