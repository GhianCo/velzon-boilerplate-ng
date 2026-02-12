import { Component, inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CajaGlobalService } from '@sothy/services/caja-global.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  // Control de pasos
  currentStep: 'caja' | 'turno' = 'caja';
  
  // Selecciones
  selectedCajaId: string | number | null = null;
  selectedTurnoId: string | number | null = null;
  selectedSupervisor: string | null = null;
  
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
    
    // Guardar TODOS (caja, turno, supervisor) en el token al confirmar
    await this.cajaGlobalService.setSelectedCaja(this.selectedCajaId);
    await this.cajaGlobalService.setSelectedTurno(this.selectedTurnoId);
    await this.cajaGlobalService.setSelectedSupervisor(this.selectedSupervisor);
    
    this.activeModal.close({ 
      cajaId: this.selectedCajaId,
      turnoId: this.selectedTurnoId,
      supervisor: this.selectedSupervisor
    });
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
