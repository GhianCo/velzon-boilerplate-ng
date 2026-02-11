import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {InventarioCajaStore} from "@app/inventario-caja/data-access/inventario.caja.store";

export const InventarioCajaNewResolver = () => {
  const inventarioCajaStore = inject(InventarioCajaStore);
  const activatedRoute = inject(ActivatedRoute);

  const id = activatedRoute.snapshot.params['id'];
  const isCerrarMode = activatedRoute.snapshot.url.some(segment => segment.path === 'cerrar');

  // Inicializar valores y denominaciones
  inventarioCajaStore.loadValoresWithDetails();

  // Cargar última operación de caja
  // Las cajas ahora se cargan globalmente desde el CajaGlobalService (topbar)
  inventarioCajaStore.loadLastOperacionCaja();

  if (id) {
    // Cargar operación de caja con detalles completos
    inventarioCajaStore.loadOperacionCajaWithDetails(id);
  }

  return {};
}
