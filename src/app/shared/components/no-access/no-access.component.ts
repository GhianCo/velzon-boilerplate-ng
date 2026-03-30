import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-no-access',
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center" style="min-height: 100vh; gap: 1rem;">
      <i class="ri-lock-2-line" style="font-size: 4rem; color: #dc3545;"></i>
      <h2 class="mb-0">Acceso denegado</h2>
      <p class="text-muted text-center" style="max-width: 400px;">
        No tienes los permisos necesarios para acceder a esta sección.
        Contacta al administrador si crees que esto es un error.
      </p>
      <button class="btn btn-primary" (click)="goBack()">Volver</button>
    </div>
  `
})
export class NoAccessComponent {
  private router = inject(Router);

  goBack(): void {
    this.router.navigate(['/']);
  }
}
