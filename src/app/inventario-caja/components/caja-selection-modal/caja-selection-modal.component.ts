import { Component, inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CajaGlobalService } from '@sothy/services/caja-global.service';
import { AuthService } from '@sothy/services/auth.service';
import { AuthLoginRemoteReq } from 'app/account/data-access/auth.login.remote.req';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-caja-selection-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja-selection-modal.component.html',
  styleUrls: ['./caja-selection-modal.component.scss']
})
export class CajaSelectionModalComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  cajaGlobalService = inject(CajaGlobalService);
  authService = inject(AuthService);
  authLoginRemoteReq = inject(AuthLoginRemoteReq);

  // Control de pasos
  currentStep: 'caja' | 'turno' = 'caja';

  // Selecciones
  selectedCajaId: string | number | null = null;
  selectedTurnoId: string | number | null = null;
  selectedSupervisor: string | null = null;

  // Preselección de turno (para flujo fromBoveda)
  preselectedTurnoId: string | number | null = null;

  // Datos
  cajas: any[] = [];
  turnos: any[] = [];

  // Estado
  loading: boolean = false;
  canCancel: boolean = true; // Se establece desde el guard

  ngOnInit(): void {
    this.loadCajas();
  }

  loadCajas(): void {
    this.loading = true;
    this.cajaGlobalService.loadCajas(-1).subscribe({
      next: () => {
        this.cajas = this.cajaGlobalService.cajas();
        this.loading = false;

        // Auto-seleccionar si solo hay una caja
        if (this.cajas.length === 1) {
          this.selectedCajaId = this.cajas[0].caja_id;
        }
      },
      error: (error) => {
        console.error('Error al cargar cajas:', error);
        this.loading = false;
      }
    });
  }

  loadTurnos(): void {
    this.loading = true;
    this.cajaGlobalService.loadTurnos().subscribe({
      next: () => {
        this.turnos = this.cajaGlobalService.turnos();
        this.loading = false;

        // Auto-seleccionar si solo hay un turno
        if (this.turnos.length === 1) {
          this.selectedTurnoId = this.turnos[0].turno_id;
          // Auto-seleccionar supervisor del turno
          if (this.turnos[0]['supervisor']) {
            this.selectedSupervisor = this.turnos[0]['supervisor'];
          }
        }

        // Si viene del flujo fromBoveda con turno preseleccionado, auto-confirmar
        // para que el usuario solo tenga que seleccionar la caja
        if (this.preselectedTurnoId) {
          const turno = this.turnos.find(t => t.turno_id == this.preselectedTurnoId);
          if (turno) {
            this.selectedTurnoId = turno.turno_id;
            if (turno['supervisor']) {
              this.selectedSupervisor = turno['supervisor'];
            }
            this.onConfirm();
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
        this.loading = false;
      }
    });
  }

  onCajaSelect(cajaId: string | number): void {
    this.selectedCajaId = cajaId;
  }

  onTurnoSelect(turnoId: string | number): void {
    this.selectedTurnoId = turnoId;

    // Auto-seleccionar el supervisor del turno seleccionado
    const turno = this.turnos.find(t => t.turno_id == turnoId);
    if (turno && turno['supervisor']) {
      this.selectedSupervisor = turno['supervisor'];
    }
  }

  onSupervisorChange(supervisor: string): void {
    this.selectedSupervisor = supervisor;
  }

  goToTurnoStep(): void {
    if (!this.selectedCajaId) return;

    // Solo cambiar de paso, NO guardar en token todavía
    this.currentStep = 'turno';
    this.loadTurnos();
  }

  goBackToCaja(): void {
    this.currentStep = 'caja';
  }

  async onConfirm(): Promise<void> {
    if (!this.selectedCajaId || !this.selectedTurnoId || !this.selectedSupervisor) {
      return;
    }

    try {
      // Obtener los nombres de caja y turno
      const caja = this.cajas.find(c => c.caja_id == this.selectedCajaId);
      const turno = this.turnos.find(t => t.turno_id == this.selectedTurnoId);

      if (!caja || !turno) {
        console.error('Caja o turno no encontrado');
        return;
      }

      const cajaNombre = caja.caja_nombre || '';
      const turnoNombre = turno.turno_nombre || '';

      // Llamar al backend para actualizar el token con las nuevas propiedades
      const response = await firstValueFrom(
        this.authLoginRemoteReq.requestRefreshToken(
          this.selectedCajaId,
          cajaNombre,
          this.selectedTurnoId,
          turnoNombre,
          this.selectedSupervisor
        )
      );

      // Actualizar el token en localStorage con el nuevo token del backend
      this.authService.accessToken = response.data;

      // Actualizar las señales del servicio global para reflejar los cambios
      this.cajaGlobalService.updateSelectionsFromBackend(
        this.selectedCajaId,
        this.selectedTurnoId,
        this.selectedSupervisor
      );

      // Cerrar el modal con los datos seleccionados
      this.activeModal.close({
        cajaId: this.selectedCajaId,
        turnoId: this.selectedTurnoId,
        supervisor: this.selectedSupervisor
      });
    } catch (error) {
      console.error('Error al actualizar token:', error);
    }
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
