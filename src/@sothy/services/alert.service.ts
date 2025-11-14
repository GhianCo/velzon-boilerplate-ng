import {Injectable} from '@angular/core';
import Swal, {SweetAlertIcon} from 'sweetalert2';

export function alertServiceFactory() {
  return new AlertService();
}

@Injectable()
export class AlertService {

  private showAlert(icon: SweetAlertIcon, title: string, text?: string, timer = 3000) {
    Swal.fire({
      position: 'top-end',
      icon,
      title,
      text,
      showConfirmButton: false,
      timer,
      toast: true
    });
  }

  success(title: string, text?: string, timer?: number) {
    this.showAlert('success', title, text, timer);
  }

  error(title: string, text?: string, timer?: number) {
    this.showAlert('error', title, text, timer);
  }

  warning(title: string, text?: string, timer?: number) {
    this.showAlert('warning', title, text, timer);
  }

  info(title: string, text?: string, timer?: number) {
    this.showAlert('info', title, text, timer);
  }
}
