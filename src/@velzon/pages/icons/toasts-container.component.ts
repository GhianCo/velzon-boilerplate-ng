import {Component, TemplateRef} from '@angular/core';

import {ToastService} from './toast-service';
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";
import {NgIf, NgTemplateOutlet} from "@angular/common";


@Component({
  selector: 'app-toasts',
  template: `
    @for (toast of toastService.toasts; track $index) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (hidden)="toastService.remove(toast)">
        <ng-template>
          @if (isTemplate(toast)) {
            <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
          } @else {
            <ng-template>{{ toast.textOrTpl }}</ng-template>
          }
        </ng-template>
      </ngb-toast>
    }
  `,
  host: {'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200'},
  imports: [
    NgbToast,
    NgTemplateOutlet
  ],
  standalone: true
})
export class ToastsContainerallicon {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: { textOrTpl: any; }) { return toast.textOrTpl instanceof TemplateRef; }
}
