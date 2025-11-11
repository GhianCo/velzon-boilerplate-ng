import {Routes} from "@angular/router";
import {InventarioEfectivoPage} from "./inventario.efectivo.page";
import {
  InventarioEfectivoList
} from "@app/inventario-efectivo/feature/inventario-efectivo-list/inventario.efectivo.list";
import {
  InventarioEfectivoListResolver
} from "@app/inventario-efectivo/feature/inventario-efectivo-list/inventario.efectivo.list.resolver";

export default [
  {
    path: '',
    component: InventarioEfectivoPage,
    children: [
      {
        path: '',
        component: InventarioEfectivoList,
        resolve: {
          data: InventarioEfectivoListResolver,
        },
      }
    ]
  }
] as Routes;
