import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CajaGlobalService } from '@sothy/services/caja-global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import type { CajaSelectionModalComponent } from '../components/caja-selection-modal/caja-selection-modal.component';

/**
 * Guard que valida si hay una caja seleccionada antes de permitir acceso al módulo
 * 
 * Comportamiento según la ruta:
 * - Lista (''): Modal opcional, puede cancelar y acceder sin caja
 * - Trabajo (nuevo/cerrar/replicar): Modal obligatorio, debe seleccionar caja o volver a lista
 */
export const CajaSelectionGuard: CanActivateFn = async (route, state) => {
    const cajaGlobalService = inject(CajaGlobalService);
    const modalService = inject(NgbModal);
    const router = inject(Router);

    // Detectar si es la ruta de lista
    const isListRoute = route.routeConfig?.path === '';

    // Cargar cajas si no están cargadas
    const cajas = cajaGlobalService.cajas();
    if (!cajas || cajas.length === 0) {
        await firstValueFrom(cajaGlobalService.loadCajas(-1));
    }

    // Verificar si hay una caja seleccionada
    if (cajaGlobalService.hasSelectedCaja()) {
        return true;
    }

    // Si no hay caja seleccionada, abrir modal
    // Importación dinámica para evitar problemas de circular dependencies
    const { CajaSelectionModalComponent } = await import('../components/caja-selection-modal/caja-selection-modal.component');

    const modalRef = modalService.open(CajaSelectionModalComponent, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
        size: 'md'
    });

    // Pasar información al modal sobre si puede cancelar
    modalRef.componentInstance.canCancel = isListRoute;

    // Esperar a que el usuario seleccione una caja
    const result = await modalRef.result;

    if (result && result.cajaId) {
        // Usuario seleccionó una caja
        await cajaGlobalService.setSelectedCaja(result.cajaId);
        return true;
    } else {
        // Usuario canceló o cerró el modal sin seleccionar
        if (isListRoute) {
            // En la lista, permitir acceso sin caja
            return true;
        } else {
            // En rutas de trabajo, redirigir a la lista
            router.navigate(['/inventario-caja']);
            return false;
        }
    }

};
