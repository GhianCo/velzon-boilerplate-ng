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
        id: 3,
        label: 'Apertura y cierre',
        link: '/inventario-efectivo',
        parentId: 2
      },
    ]
  },
  {
    id: 4,
    label: 'Maestras',
    icon: 'ri-number-2',
    subItems: [
      {
        id: 5,
        label: 'Valores',
        link: '/valor',
        parentId: 4
      },
    ]
  },
]
