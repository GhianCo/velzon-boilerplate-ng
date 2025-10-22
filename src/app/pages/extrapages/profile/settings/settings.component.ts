import { Component, OnInit } from '@angular/core';

import { TokenStorageService } from '../../../../core/services/token-storage.service';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {FlatpickrModule} from "angularx-flatpickr";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    NgbNav,
    NgbNavItem,
    FlatpickrModule,
    NgSelectComponent,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet
  ],
  standalone: true
})

/**
 * Profile Settings Component
 */
export class SettingsComponent implements OnInit {

  userData:any;

  constructor(private TokenStorageService : TokenStorageService) { }

  ngOnInit(): void {
    this.userData =  this.TokenStorageService.getUser();
  }

  /**
  * Multiple Default Select2
  */
   selectValue = ['Illustrator', 'Photoshop', 'CSS', 'HTML', 'Javascript', 'Python', 'PHP'];

}
