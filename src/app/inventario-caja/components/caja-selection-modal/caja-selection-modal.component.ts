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

  selectedCajaId: string | number | null = null;
  cajas: any[] = [];
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

  onCajaSelect(cajaId: string | number): void {
    this.selectedCajaId = cajaId;
  }

  onConfirm(): void {
    if (!this.selectedCajaId) {
      return;
    }
    
    this.activeModal.close({ cajaId: this.selectedCajaId });
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
