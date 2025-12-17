import {Routes} from "@angular/router";
import {InventarioEfectivoPage} from "./inventario.efectivo.page";
import {
  InventarioEfectivoList
} from "@app/inventario-efectivo/feature/inventario-efectivo-list/inventario.efectivo.list";
import {
  InventarioEfectivoListResolver
} from "@app/inventario-efectivo/feature/inventario-efectivo-list/inventario.efectivo.list.resolver";
import {InventarioEfectivoNew} from "@app/inventario-efectivo/feature/inventario-efectivo-new/inventario.efectivo.new";
import {
  InventarioEfectivoNewResolver
} from "@app/inventario-efectivo/feature/inventario-efectivo-new/inventario.efectivo.new.resolver";
import {
  InventarioEfectivoReplicarResolver
} from "@app/inventario-efectivo/feature/inventario-efectivo-new/inventario.efectivo.replicar.resolver";
import {
  InventarioEfectivoVisualizar
} from "@app/inventario-efectivo/feature/inventario-efectivo-visualizar/inventario.efectivo.visualizar";
import { AperturaTurnoGuard } from "@app/inventario-efectivo/guards/apertura-turno.guard";

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
      },
      {
        path: "nuevo",
        component: InventarioEfectivoNew,
        canActivate: [AperturaTurnoGuard],
        resolve: {
          data: InventarioEfectivoNewResolver,
        },
      },
      {
        path: "cerrar/:id",
        component: InventarioEfectivoNew,
        resolve: {
          data: InventarioEfectivoNewResolver,
        },
      },
      {
        path: "replicar/:id",
        component: InventarioEfectivoNew,
        resolve: {
          data: InventarioEfectivoReplicarResolver,
        },
      },
      {
        path: "visualizar/:id",
        component: InventarioEfectivoVisualizar,
      },
    ]
  }
] as Routes;
