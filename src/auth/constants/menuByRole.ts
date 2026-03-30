import { UserRole } from '../types/auth.types'

// 1. Actualizamos la interfaz MenuItem
export interface MenuItem {
  label: string;
  path?: string;      // Ahora es opcional (?) porque los menús con hijos a veces no tienen link
  icon?: string;
  subItems?: MenuItem[]; // Añadimos la propiedad opcional para submenús
}

type MenuByRole = { [key in typeof UserRole[keyof typeof UserRole]]: MenuItem[] };

export const MENU_BY_ROLE: MenuByRole = {
  [UserRole.SUPER_USER]: [
    { 
      label: 'Pedidos',
      subItems: [
        { label: 'Estado de trabajo', path: '/orders/home' },
        { label: 'Historico de pedidos', path: '/config/actionss' }
      ]
    },
    { 
      label: 'Configuración',
      subItems: [
        { label: 'Acción y Subacción', path: '/config/actions' },
        { label: 'Opción 2', path: '/config/actionss' },
        { label: 'Opción 3', path: '/config/actionss' }
      ]
    },
  ],
  [UserRole.SUPERVISOR]: [
    { label: 'Pedidos', path: '/orders/home'},
  ],
  [UserRole.VIEWER]: [
    { label: 'Pedidos', path: '/orders/home'},
    { label: 'Deme pedido', path: '/advisor/home'},
    { label: 'Pedidos gestionados', path: '/offers/managed'},
  ],
  [UserRole.ASESOR]: [
    { label: 'Deme pedido', path: '/advisor/home'},
  ],
};