import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  standalone: true,
  templateUrl: 'inventario.efectivo.page.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet
  ]
})
export class InventarioEfectivoPage {
  constructor() {
  }
}
