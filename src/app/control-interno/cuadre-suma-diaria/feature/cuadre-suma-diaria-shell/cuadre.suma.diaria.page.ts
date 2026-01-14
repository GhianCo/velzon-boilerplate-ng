import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  standalone: true,
  templateUrl: 'cuadre.suma.diaria.page.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet
  ]
})
export class CuadreSumaDiariaPage {
  constructor() {
  }
}
