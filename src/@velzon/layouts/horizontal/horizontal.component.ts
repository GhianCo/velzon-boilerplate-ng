import { Component, OnInit } from '@angular/core';
import {TopbarComponent} from "@velzon/layouts/topbar/topbar.component";
import {HorizontalTopbarComponent} from "@velzon/layouts/horizontal-topbar/horizontal-topbar.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "@velzon/layouts/footer/footer.component";

@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss'],
  imports: [
    TopbarComponent,
    HorizontalTopbarComponent,
    RouterOutlet,
    FooterComponent,
  ],
  standalone: true
})

/**
 * Horizontal Component
 */
export class HorizontalComponent implements OnInit {

  constructor() { }

  isCondensed = false;

  ngOnInit(): void {
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if (rightBar != null) {
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style', "visibility: visible;");
    }
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    if (document.documentElement.clientWidth <= 1024) {
      document.body.classList.toggle('menu');
    }
  }

}
