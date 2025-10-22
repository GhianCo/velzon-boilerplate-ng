import { Component, OnInit } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-alt',
  templateUrl: './alt.component.html',
  styleUrls: ['./alt.component.scss'],
  imports: [
    RouterLink
  ],
  standalone: true
})

/**
 * 404 Alt Component
 */
export class AltComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
