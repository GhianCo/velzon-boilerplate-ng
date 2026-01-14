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
    label: 'Control interno',
    icon: 'ri-number-2',
    subItems: [
      {
        id: 1,
        label: 'Cuadrar suma diaria',
        link: '/cuadre-suma-diaria',
        parentId: 3
      },
    ]
  },
  {
    id: 4,
    label: 'Maestras',
    icon: 'ri-number-3',
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
