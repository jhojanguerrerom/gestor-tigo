import { UserRole } from '../types/auth.types'

type MenuItem = { label: string; path: string; icon?: string };
type MenuByRole = { [key in typeof UserRole[keyof typeof UserRole]]: MenuItem[] };

export const MENU_BY_ROLE: MenuByRole = {
  [UserRole.SUPER_USER]: [
    { label: 'Pedidos', path: '/orders/home'},
    { label: 'Deme pedido', path: '/advisor/home'},
    { label: 'Pedidos gestionados', path: '/offers/managed'},
  ],
  [UserRole.SUPERVISOR]: [
    { label: 'Pedidos', path: '/orders/home'},
    { label: 'Deme pedido', path: '/advisor/home'},
    { label: 'Pedidos gestionados', path: '/offers/managed'},
  ],
  [UserRole.VIEWER]: [
    { label: 'Pedidos', path: '/orders/home'},
    { label: 'Deme pedido', path: '/advisor/home'},
    { label: 'Pedidos gestionados', path: '/offers/managed'},
  ],
  [UserRole.ASESOR]: [
    { label: 'Deme pedido', path: '/advisor/home'},
    { label: 'Pedidos gestionados', path: '/offers/managed'},
  ],
};
