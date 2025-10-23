import {Routes} from "@angular/router";
import {InventarioEfectivoPage} from "./inventario.efectivo.page";
import {
  InventarioEfectivoList
} from "@app/inventario-efectivo/feature/inventario-efectivo-list/inventario.efectivo.list";

export default [
  {
    path: '',
    component: InventarioEfectivoPage,
    children: [
      {
        path: '',
        component: InventarioEfectivoList,
      }
    ]
  }
] as Routes;
