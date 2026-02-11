import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Menú',
    isTitle: true
  },
  {
    id: 2,
    label: 'Turno',
    icon: 'ri-number-1',
    subItems: [
      {
        id: 1,
        label: 'Apertura y cierre',
        link: '/inventario-efectivo',
        parentId: 2
      },
    ]
  },
  {
    id: 3,
    label: 'Caja',
    icon: 'ri-safe-2-line',
    subItems: [
      {
        id: 1,
        label: 'Apertura y cierre',
        link: '/inventario-caja',
        parentId: 3
      },
    ]
  },
  {
    id: 4,
    label: 'Control interno',
    icon: 'ri-number-2',
    subItems: [
      {
        id: 1,
        label: 'Cuadrar suma diaria',
        link: '/cuadre-suma-diaria',
        parentId: 4
      },
    ]
  },
  {
    id: 5,
    label: 'Maestras',
    icon: 'ri-number-3',
    subItems: [
      {
        id: 1,
        label: 'Valores',
        link: '/valor',
        parentId: 5
      },
    ]
  },
]
