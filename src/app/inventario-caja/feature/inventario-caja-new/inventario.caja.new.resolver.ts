import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {InventarioCajaStore} from "@app/inventario-caja/data-access/inventario.caja.store";
import {CajaGlobalService} from "@sothy/services/caja-global.service";

export const InventarioCajaNewResolver = () => {
  const inventarioCajaStore = inject(InventarioCajaStore);
  const activatedRoute = inject(ActivatedRoute);
  const cajaGlobalService = inject(CajaGlobalService);

  const id = activatedRoute.snapshot.params['id'];
  const isCerrarMode = activatedRoute.snapshot.url.some(segment => segment.path === 'cerrar');

  // En modo nuevo (sin id), pasar caja_id como query param al request
  const cajaId = (!id && !isCerrarMode) ? cajaGlobalService.selectedCajaId() : undefined;

  // Inicializar valores y denominaciones
  inventarioCajaStore.loadValoresWithDetails(cajaId);

  // Cargar última operación de caja
  // Las cajas ahora se cargan globalmente desde el CajaGlobalService (topbar)
  inventarioCajaStore.loadLastOperacionCaja();

  if (id) {
    // Cargar operación de caja con detalles completos
    inventarioCajaStore.loadOperacionCajaWithDetails(id);
  }

  return {};
}
