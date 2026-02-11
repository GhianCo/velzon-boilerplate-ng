import {Routes} from "@angular/router";
import {InventarioCajaPage} from "./inventario.caja.page";
import {
  InventarioCajaList
} from "@app/inventario-caja/feature/inventario-caja-list/inventario.caja.list";
import {
  InventarioCajaListResolver
} from "@app/inventario-caja/feature/inventario-caja-list/inventario.caja.list.resolver";
import {InventarioCajaNew} from "@app/inventario-caja/feature/inventario-caja-new/inventario.caja.new";
import {
  InventarioCajaNewResolver
} from "@app/inventario-caja/feature/inventario-caja-new/inventario.caja.new.resolver";
import {
  InventarioCajaReplicarResolver
} from "@app/inventario-caja/feature/inventario-caja-new/inventario.caja.replicar.resolver";
import {
  InventarioCajaVisualizar
} from "@app/inventario-caja/feature/inventario-caja-visualizar/inventario.caja.visualizar";
import { AperturaCajaGuard } from "@app/inventario-caja/guards/apertura-caja.guard";

export default [
  {
    path: '',
    component: InventarioCajaPage,
    children: [
      {
        path: '',
        component: InventarioCajaList,
        resolve: {
          data: InventarioCajaListResolver,
        },
      },
      {
        path: "nuevo",
        component: InventarioCajaNew,
        canActivate: [AperturaCajaGuard],
        resolve: {
          data: InventarioCajaNewResolver,
        },
      },
      {
        path: "cerrar/:id",
        component: InventarioCajaNew,
        resolve: {
          data: InventarioCajaNewResolver,
        },
      },
      {
        path: "replicar/:id",
        component: InventarioCajaNew,
        resolve: {
          data: InventarioCajaReplicarResolver,
        },
      },
      {
        path: "visualizar/:id",
        component: InventarioCajaVisualizar,
      },
    ]
  }
] as Routes;
