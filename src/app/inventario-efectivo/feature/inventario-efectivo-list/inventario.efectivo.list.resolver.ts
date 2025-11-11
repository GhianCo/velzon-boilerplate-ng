import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

export const InventarioEfectivoListResolver = () => {
    const transportistaStore = inject(InventarioEfectivoStore);
    return transportistaStore.loadAllInvetarioEfectivoStore()
}
