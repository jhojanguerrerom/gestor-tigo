import { UserRole } from '../types/auth.types'

// 1. Actualizamos la interfaz MenuItem
export interface MenuItem {
  label: string;
  path?: string;      // Es opcional (?) porque los menús con hijos a veces no tienen link
  icon?: string;
  subItems?: MenuItem[]; // Añadimos la propiedad opcional para submenús
}

type MenuByRole = { [key in typeof UserRole[keyof typeof UserRole]]: MenuItem[] };

export const MENU_BY_ROLE: MenuByRole = {
  [UserRole.SUPER_USER]: [
    { 
      label: '(e) Pedidos',
      subItems: [
        { label: 'Estado de trabajo', path: '/orders/home' },
        { label: 'Historico de pedidos', path: '/offers/managed' }
      ]
    },
    { 
      label: '(e) Indicadores',
      subItems: [
        { label: 'Pruductividad', path: '/reports/management-by-hour' },
        { label: 'Ingresos y Gestiones', path: '/reports/historical-income' }
      ]
    },
    { 
      label: '(e) Configuración',
      subItems: [
        { label: 'Acción y Subacción', path: '/config/actions' }
      ]
    },
  ],
  [UserRole.SUPERVISOR]: [
    { 
      label: '(e) Pedidos',
      subItems: [
        { label: 'Estado de trabajo', path: '/orders/home' },
        { label: 'Historico de pedidos', path: '/offers/managed' }
      ]
    },
    { 
      label: '(e) Indicadores',
      subItems: [
        { label: 'Pruductividad', path: '/reports/management-by-hour' },
        { label: 'Ingresos y Gestiones', path: '/reports/historical-income' }
      ]
    },
    { 
      label: '(e) Configuración',
      subItems: [
        { label: 'Acción y Subacción', path: '/config/actions' }
      ]
    },
  ],
  [UserRole.VIEWER]: [
    { 
      label: '(e) Indicadores',
      subItems: [
        { label: 'Pruductividad', path: '/reports/management-by-hour' },
        { label: 'Ingresos y Gestiones', path: '/reports/historical-income' }
      ]
    },
  ],
  [UserRole.ASESOR]: [
    { label: '(e) Deme pedido', path: '/advisor/home'},
  ],
};